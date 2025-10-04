import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Expense, ApiResponse } from "@/types";
import { generateId } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/expenses - Get all expenses with optional filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const minAmount = searchParams.get("minAmount");
    const maxAmount = searchParams.get("maxAmount");

    const filters: Record<string, string | number> = {};
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;
    if (minAmount) filters.minAmount = parseFloat(minAmount);
    if (maxAmount) filters.maxAmount = parseFloat(maxAmount);

    // Add user/company filter based on role
    if (session.user.role === "employee") {
      filters.userId = session.user.id;
    } else if (
      session.user.role === "manager" ||
      session.user.role === "admin"
    ) {
      filters.companyId = session.user.companyId;
    }

    const expenses =
      Object.keys(filters).length > 0
        ? await db.expenses.filter(filters)
        : await db.expenses.getAll();

    const response: ApiResponse<Expense[]> = {
      success: true,
      data: expenses,
    };

    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch expenses",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/expenses - Create a new expense
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const newExpense: Expense = {
      id: generateId(),
      userId: session.user.id,
      companyId: session.user.companyId,
      amount: body.amount,
      category: body.category,
      description: body.description,
      date: body.date,
      paymentMethod: body.paymentMethod,
      status: "Draft", // Start as draft
      receiptUrl: body.receiptUrl,
      tags: body.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const expense = await db.expenses.create(newExpense);

    const response: ApiResponse<Expense> = {
      success: true,
      data: expense,
      message:
        "Expense created successfully. Click 'Submit for Approval' to send for review.",
    };

    return NextResponse.json(response, { status: 201 });
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to create expense",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
