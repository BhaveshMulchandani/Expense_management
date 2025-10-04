import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import ExpenseModel from "@/models/Expense";
import ApprovalRuleModel from "@/models/ApprovalRule";

// POST /api/approvals/:expenseId/approve - Approve expense
export async function POST(
  request: NextRequest,
  { params }: { params: { expenseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "employee") {
      return NextResponse.json(
        { error: "Forbidden - Only managers can approve expenses" },
        { status: 403 }
      );
    }

    const { expenseId } = params;
    const { comment } = await request.json();

    await dbConnect();

    const expense = await ExpenseModel.findOne({
      id: expenseId,
      companyId: session.user.companyId,
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    if (!["Submitted", "Waiting Approval"].includes(expense.status)) {
      return NextResponse.json(
        { error: "Expense is not pending approval" },
        { status: 400 }
      );
    }

    // Find this approver's approval
    const approvalIndex = expense.approvals?.findIndex(
      (a) => a.approverId === session.user.id && a.status === "Pending"
    );

    if (approvalIndex === -1 || approvalIndex === undefined) {
      return NextResponse.json(
        { error: "You are not authorized to approve this expense" },
        { status: 403 }
      );
    }

    // Update approval status
    if (expense.approvals) {
      expense.approvals[approvalIndex].status = "Approved";
      expense.approvals[approvalIndex].comment = comment;
      expense.approvals[approvalIndex].approvedAt = new Date();
    }

    // Find applicable rule to check approval logic
    const rules = await ApprovalRuleModel.find({
      companyId: session.user.companyId,
      isActive: true,
    }).sort({ minAmount: 1 });

    const amountForRule = expense.convertedAmount || expense.amount;

    const applicableRule = rules.find(
      (rule) =>
        amountForRule >= rule.minAmount &&
        (rule.maxAmount === null || amountForRule <= rule.maxAmount) &&
        (rule.categories.length === 0 ||
          rule.categories.includes(expense.category))
    );

    // Check if specific approver rule applies
    if (
      applicableRule &&
      applicableRule.specificApproverRule?.enabled &&
      applicableRule.specificApproverRule.approverId === session.user.id
    ) {
      // Auto-approve entire expense
      expense.status = "Approved";
      expense.approvedAt = new Date();
      expense.updatedAt = new Date().toISOString();
      await expense.save();

      return NextResponse.json(
        {
          message: "Expense approved (specific approver rule)",
          expense,
          autoApproved: true,
        },
        { status: 200 }
      );
    }

    // Check if sequential approval
    if (applicableRule && applicableRule.isSequential) {
      const currentApproval = expense.approvals?.[approvalIndex];
      const nextApproval = expense.approvals?.find(
        (a) => a.order === (currentApproval?.order || 0) + 1
      );

      if (nextApproval) {
        // Move to next approver
        expense.status = "Waiting Approval";
      } else {
        // Last approver approved
        expense.status = "Approved";
        expense.approvedAt = new Date();
      }
    } else {
      // Parallel approval - check percentage
      const approvedCount =
        expense.approvals?.filter((a) => a.status === "Approved").length || 0;
      const totalCount = expense.approvals?.length || 1;
      const percentage = (approvedCount / totalCount) * 100;

      const requiredPercentage = applicableRule?.minApprovalPercentage || 100;

      if (percentage >= requiredPercentage) {
        expense.status = "Approved";
        expense.approvedAt = new Date();
      } else {
        expense.status = "Waiting Approval";
      }
    }

    expense.updatedAt = new Date().toISOString();
    await expense.save();

    return NextResponse.json(
      { message: "Expense approved successfully", expense },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving expense:", error);
    return NextResponse.json(
      { error: "Failed to approve expense" },
      { status: 500 }
    );
  }
}
