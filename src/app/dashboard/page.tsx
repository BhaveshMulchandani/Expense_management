"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Loading } from "@/components/Loading";
import { formatCurrency } from "@/lib/utils";
import { DashboardStats, Budget } from "@/types";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    fetchBudgets();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch("/api/dashboard");
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await fetch("/api/budgets");
      const data = await response.json();
      if (data.success) {
        setBudgets(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch budgets:", error);
    }
  };

  const alertBudgets = budgets.filter((b) => b.shouldAlert || b.isExceeded);

  if (loading) return <Loading />;
  if (!stats) return <div>Failed to load dashboard</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Budget Alerts */}
      {alertBudgets.length > 0 && (
        <div className="mb-8">
          <Card
            title="⚠️ Budget Alerts"
            className="border-l-4 border-l-yellow-500"
          >
            <div className="space-y-3">
              {alertBudgets.map((budget) => (
                <div
                  key={budget.id}
                  className={`p-3 rounded-lg ${
                    budget.isExceeded ? "bg-red-50" : "bg-yellow-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p
                        className={`font-semibold ${
                          budget.isExceeded ? "text-red-800" : "text-yellow-800"
                        }`}
                      >
                        {budget.category} Budget{" "}
                        {budget.isExceeded ? "Exceeded" : "Alert"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(budget.spent || 0)} of{" "}
                        {formatCurrency(budget.amount)} (
                        {budget.percentage?.toFixed(1)}%)
                      </p>
                    </div>
                    <Link
                      href="/budgets"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Manage →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">
              Total Expenses
            </span>
            <span className="text-2xl font-bold text-gray-900 mt-2">
              {formatCurrency(stats.totalExpenses)}
            </span>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">
              This Month
            </span>
            <span className="text-2xl font-bold text-gray-900 mt-2">
              {formatCurrency(stats.monthlyTotal)}
            </span>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">
              Total Categories
            </span>
            <span className="text-2xl font-bold text-gray-900 mt-2">
              {stats.categoryBreakdown.length}
            </span>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">
              Total Transactions
            </span>
            <span className="text-2xl font-bold text-gray-900 mt-2">
              {stats.recentExpenses.length}
            </span>
          </div>
        </Card>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Category Breakdown">
          <div className="space-y-4">
            {stats.categoryBreakdown.slice(0, 5).map((category) => (
              <div key={category.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{category.category}</span>
                  <span className="text-gray-600">
                    {formatCurrency(category.amount)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Expenses */}
        <Card title="Recent Expenses">
          <div className="space-y-3">
            {stats.recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex justify-between items-start border-b border-gray-100 pb-3 last:border-0"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {expense.description}
                  </p>
                  <p className="text-sm text-gray-500">{expense.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/expenses"
            className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Expenses →
          </Link>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card title="Monthly Trend">
        <div className="space-y-4">
          {stats.monthlyTrend.map((month) => (
            <div
              key={month.month}
              className="flex justify-between items-center"
            >
              <span className="font-medium text-gray-700">{month.month}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {month.count} expenses
                </span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(month.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
