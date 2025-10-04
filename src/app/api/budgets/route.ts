import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BudgetModel from "@/models/Budget";
import ExpenseModel from "@/models/Expense";
import { Budget, BudgetStatus, ApiResponse } from "@/types";
import { generateId } from "@/lib/utils";

// GET /api/budgets - Get all budgets with their status
export async function GET() {
  try {
    await connectDB();

    const budgets = await BudgetModel.find({}).lean();
    const budgetStatuses: BudgetStatus[] = [];

    for (const budget of budgets) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...budgetData } = budget;

      // Calculate spent amount for this budget
      const now = new Date();
      const startDate = new Date(budget.startDate);
      let endDate: Date;

      if (budget.endDate) {
        endDate = new Date(budget.endDate);
      } else if (budget.period === "monthly") {
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      // Only calculate if budget is active
      if (now >= startDate && now <= endDate) {
        const expenses = await ExpenseModel.find({
          category: budget.category,
          date: {
            $gte: startDate.toISOString().split("T")[0],
            $lte: endDate.toISOString().split("T")[0],
          },
          status: "Approved",
        }).lean();

        const spent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const remaining = budget.amount - spent;
        const percentage = (spent / budget.amount) * 100;
        const isExceeded = spent > budget.amount;
        const shouldAlert = percentage >= budget.alertThreshold;

        budgetStatuses.push({
          budget: budgetData as Budget,
          spent,
          remaining,
          percentage,
          isExceeded,
          shouldAlert,
        });
      }
    }

    const response: ApiResponse<BudgetStatus[]> = {
      success: true,
      data: budgetStatuses,
    };

    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch budgets",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/budgets - Create a new budget
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const newBudget: Budget = {
      id: generateId(),
      category: body.category,
      amount: body.amount,
      period: body.period,
      startDate: body.startDate,
      endDate: body.endDate,
      alertThreshold: body.alertThreshold || 80,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const budget = new BudgetModel(newBudget);
    await budget.save();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...budgetData } = budget.toObject();

    const response: ApiResponse<Budget> = {
      success: true,
      data: budgetData as Budget,
      message: "Budget created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to create budget",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
