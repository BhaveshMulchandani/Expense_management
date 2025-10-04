import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  AnalyticsData,
  ApiResponse,
  ExpenseCategory,
  PaymentMethod,
} from "@/types";

export async function GET() {
  try {
    const expenses = await db.expenses.getAll();

    const totalSpent = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const avgDaily = totalSpent / Math.max(1, expenses.length);

    // Calculate average monthly
    const monthsMap = new Map<string, number>();
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthsMap.set(key, (monthsMap.get(key) || 0) + expense.amount);
    });
    const avgMonthly =
      Array.from(monthsMap.values()).reduce((a, b) => a + b, 0) /
      Math.max(1, monthsMap.size);

    // Top category
    const categoryMap = new Map<string, number>();
    expenses.forEach((expense) => {
      categoryMap.set(
        expense.category,
        (categoryMap.get(expense.category) || 0) + expense.amount
      );
    });
    const topCategory =
      Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "Food";

    // Category analysis
    const categoryAnalysis = Array.from(categoryMap.entries()).map(
      ([category, amount]) => {
        const count = expenses.filter((e) => e.category === category).length;
        return {
          category: category as ExpenseCategory,
          amount,
          percentage: (amount / totalSpent) * 100,
          count,
        };
      }
    );

    // Payment method analysis
    const paymentMethodMap = new Map<
      string,
      { amount: number; count: number }
    >();
    expenses.forEach((expense) => {
      const current = paymentMethodMap.get(expense.paymentMethod) || {
        amount: 0,
        count: 0,
      };
      paymentMethodMap.set(expense.paymentMethod, {
        amount: current.amount + expense.amount,
        count: current.count + 1,
      });
    });

    const paymentMethodAnalysis = Array.from(paymentMethodMap.entries()).map(
      ([method, data]) => ({
        method: method as PaymentMethod,
        amount: data.amount,
        count: data.count,
      })
    );

    // Time analysis - simplified version
    const dailyMap = new Map<string, number>();
    expenses.forEach((expense) => {
      dailyMap.set(
        expense.date,
        (dailyMap.get(expense.date) || 0) + expense.amount
      );
    });

    const analytics: AnalyticsData = {
      overview: {
        totalSpent,
        averageDaily: avgDaily,
        averageMonthly: avgMonthly,
        topCategory: topCategory as ExpenseCategory,
      },
      categoryAnalysis,
      timeAnalysis: {
        daily: Array.from(dailyMap.entries()).map(([date, amount]) => ({
          date,
          amount,
        })),
        weekly: [],
        monthly: [],
      },
      paymentMethodAnalysis,
    };

    const response: ApiResponse<AnalyticsData> = {
      success: true,
      data: analytics,
    };

    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch analytics",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
