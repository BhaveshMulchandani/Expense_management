import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BudgetModel from "@/models/Budget";
import { Budget, ApiResponse } from "@/types";

// GET /api/budgets/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const budget = await BudgetModel.findOne({ id }).lean();

    if (!budget) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Budget not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = budget;
    const response: ApiResponse<Budget> = {
      success: true,
      data: rest as Budget,
    };

    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch budget",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT /api/budgets/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const updatedBudget = await BudgetModel.findOneAndUpdate(
      { id },
      { ...body, updatedAt: new Date().toISOString() },
      { new: true }
    ).lean();

    if (!updatedBudget) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Budget not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = updatedBudget;
    const response: ApiResponse<Budget> = {
      success: true,
      data: rest as Budget,
      message: "Budget updated successfully",
    };

    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to update budget",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE /api/budgets/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const result = await BudgetModel.deleteOne({ id });

    if (result.deletedCount === 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Budget not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<never> = {
      success: true,
      message: "Budget deleted successfully",
    };

    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to delete budget",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
