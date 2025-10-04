import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Expense, ApiResponse } from "@/types";

// GET /api/expenses/[id] - Get a single expense
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const expense = await db.expenses.getById(id);

    if (!expense) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Expense not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Expense> = {
      success: true,
      data: expense,
    };

    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch expense",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT /api/expenses/[id] - Update an expense
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const expense = await db.expenses.update(id, body);

    if (!expense) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Expense not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Expense> = {
      success: true,
      data: expense,
      message: "Expense updated successfully",
    };

    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to update expense",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE /api/expenses/[id] - Delete an expense
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await db.expenses.delete(id);

    if (!deleted) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Expense not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<never> = {
      success: true,
      message: "Expense deleted successfully",
    };

    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to delete expense",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
