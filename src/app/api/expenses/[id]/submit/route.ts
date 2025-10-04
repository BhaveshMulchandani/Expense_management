/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import ExpenseModel from "@/models/Expense";
import ApprovalRuleModel from "@/models/ApprovalRule";
import UserModel from "@/models/User";
import CompanyModel from "@/models/Company";

// POST /api/expenses/:id/submit - Submit expense for approval
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await dbConnect();

    // Find expense
    const expense = await ExpenseModel.findOne({
      id,
      userId: session.user.id,
      companyId: session.user.companyId,
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    if (expense.status !== "Draft") {
      return NextResponse.json(
        { error: "Only draft expenses can be submitted" },
        { status: 400 }
      );
    }

    // Get company for currency conversion if needed
    const company = await CompanyModel.findOne({
      id: session.user.companyId,
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Handle currency conversion if expense is in different currency
    let convertedAmount = expense.amount;
    let exchangeRate = 1;

    if (expense.currency && expense.currency !== company.currency) {
      // Fetch exchange rate
      const rateResponse = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${expense.currency}`
      );
      const rateData = await rateResponse.json();
      exchangeRate = rateData.rates[company.currency] || 1;
      convertedAmount = expense.amount * exchangeRate;

      // Store conversion details
      expense.convertedAmount = convertedAmount;
      expense.companyCurrency = company.currency;
      expense.exchangeRate = exchangeRate;
      expense.conversionDate = new Date();
    } else {
      // Same currency
      expense.currency = company.currency;
      expense.currencySymbol = company.currencySymbol;
      expense.convertedAmount = expense.amount;
      expense.companyCurrency = company.currency;
      expense.exchangeRate = 1;
    }

    // Find applicable approval rule
    const rules = await ApprovalRuleModel.find({
      companyId: session.user.companyId,
      isActive: true,
    }).sort({ minAmount: 1 });

    // Use converted amount for rule matching
    const amountForRule = expense.convertedAmount || expense.amount;

    const applicableRule = rules.find(
      (rule) =>
        amountForRule >= rule.minAmount &&
        (rule.maxAmount === null || amountForRule <= rule.maxAmount) &&
        (rule.categories.length === 0 ||
          rule.categories.includes(expense.category))
    );

    if (!applicableRule) {
      // No rule found - require manager approval by default
      const user = await UserModel.findOne({ id: session.user.id });

      if (!user || !user.managerId) {
        return NextResponse.json(
          { error: "No approval rule found and no manager assigned" },
          { status: 400 }
        );
      }

      expense.approvals = [
        {
          approverId: user.managerId,
          order: 1,
          status: "Pending",
        },
      ];
      expense.isManagerApproverRequired = true;
    } else {
      // Build approvals list
      const approvals: Array<{
        approverId: string;
        order: number;
        status: "Pending" | "Approved" | "Rejected";
      }> = [];

      let currentOrder = 1;

      // Add manager if required
      if (applicableRule.isManagerApproverRequired) {
        const user = await UserModel.findOne({ id: session.user.id });

        if (user && user.managerId) {
          approvals.push({
            approverId: user.managerId,
            order: currentOrder++,
            status: "Pending",
          });
        }
      }

      // Add rule approvers
      applicableRule.approvers.forEach((approver) => {
        if (approver.userId) {
          approvals.push({
            approverId: approver.userId,
            order: currentOrder++,
            status: "Pending",
          });
        }
      });

      expense.approvals = approvals as any;
      expense.isManagerApproverRequired =
        applicableRule.isManagerApproverRequired;
    }

    expense.status = "Submitted";
    expense.submittedAt = new Date() as any;
    expense.updatedAt = new Date() as any;

    await expense.save();

    return NextResponse.json(
      { message: "Expense submitted for approval", expense },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting expense:", error);
    return NextResponse.json(
      { error: "Failed to submit expense" },
      { status: 500 }
    );
  }
}
