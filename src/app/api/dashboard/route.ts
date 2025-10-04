import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  DashboardStats,
  ApiResponse,
  CategoryBreakdown,
  MonthlyTrend,
  ExpenseCategory,
} from "@/types";

export async function GET() {
  try {
    const expenses = await db.expenses.getAll();

    // Calculate total expenses
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Calculate monthly total (current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });
    const monthlyTotal = monthlyExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Category breakdown
    const categoryMap = new Map<string, { amount: number; count: number }>();
    expenses.forEach((expense) => {
      const current = categoryMap.get(expense.category) || {
        amount: 0,
        count: 0,
      };
      categoryMap.set(expense.category, {
        amount: current.amount + expense.amount,
        count: current.count + 1,
      });
    });

    const categoryBreakdown: CategoryBreakdown[] = Array.from(
      categoryMap.entries()
    ).map(([category, data]) => ({
      category: category as ExpenseCategory,
      amount: data.amount,
      percentage: (data.amount / totalExpenses) * 100,
      count: data.count,
    }));

    // Recent expenses (last 5)
    const recentExpenses = [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    // Monthly trend (last 6 months)
    const monthlyTrend: MonthlyTrend[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.getMonth();
      const year = date.getFullYear();

      const monthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === month && expenseDate.getFullYear() === year
        );
      });

      monthlyTrend.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        amount: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
        count: monthExpenses.length,
      });
    }

    const stats: DashboardStats = {
      totalExpenses,
      monthlyTotal,
      categoryBreakdown,
      recentExpenses,
      monthlyTrend,
    };

    const response: ApiResponse<DashboardStats> = {
      success: true,
      data: stats,
    };

    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch dashboard stats",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
