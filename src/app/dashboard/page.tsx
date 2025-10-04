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
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-violet-50 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-2 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Your financial overview at a glance
          </p>
        </div>

        {/* Budget Alerts */}
        {alertBudgets.length > 0 && (
          <div className="mb-8">
            <Card
              title="⚠️ Budget Alerts"
              className="border-l-4 border-l-amber-500"
              variant="gradient"
            >
              <div className="space-y-3">
                {alertBudgets.map((budget) => (
                  <div
                    key={budget.id}
                    className={`p-4 rounded-xl backdrop-blur-sm ${
                      budget.isExceeded 
                        ? "bg-red-100/80 dark:bg-red-950/50 border border-red-300 dark:border-red-800" 
                        : "bg-amber-100/80 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className={`font-bold text-lg ${
                          budget.isExceeded 
                            ? "text-red-800 dark:text-red-300" 
                            : "text-amber-800 dark:text-amber-300"
                        }`}>
                          {budget.category} Budget{" "}
                          {budget.isExceeded ? "Exceeded 🚨" : "Alert 🔔"}
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">
                          {formatCurrency(budget.spent || 0)} of{" "}
                          {formatCurrency(budget.amount)} (
                          {budget.percentage?.toFixed(1)}%)
                        </p>
                        <div className="w-full bg-white/50 dark:bg-slate-900/50 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full ${
                              budget.isExceeded 
                                ? "bg-gradient-to-r from-red-500 to-red-700" 
                                : "bg-gradient-to-r from-amber-500 to-amber-700"
                            }`}
                            style={{ width: `${Math.min(budget.percentage || 0, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <Link
                        href="/budgets"
                        className="px-4 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-md hover:shadow-lg transition-all duration-200"
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
          <Card hover variant="gradient">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💰</span>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Total Expenses
                  </span>
                </div>
                <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
                  {formatCurrency(stats.totalExpenses)}
                </span>
              </div>
            </div>
          </Card>

          <Card hover variant="gradient">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📅</span>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    This Month
                  </span>
                </div>
                <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
                  {formatCurrency(stats.monthlyTotal)}
                </span>
              </div>
            </div>
          </Card>

          <Card hover variant="gradient">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📊</span>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Categories
                  </span>
                </div>
                <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
                  {stats.categoryBreakdown.length}
                </span>
              </div>
            </div>
          </Card>

          <Card hover variant="gradient">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📝</span>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Transactions
                  </span>
                </div>
                <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
                  {stats.recentExpenses.length}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Category Breakdown & Recent Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card title="📊 Category Breakdown" variant="glass">
            <div className="space-y-5">
              {stats.categoryBreakdown.slice(0, 5).map((category, index) => {
                const gradients = [
                  "from-violet-500 to-purple-600",
                  "from-blue-500 to-indigo-600",
                  "from-emerald-500 to-teal-600",
                  "from-amber-500 to-orange-600",
                  "from-pink-500 to-rose-600",
                ];
                return (
                  <div key={category.category}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {category.category}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 font-semibold">
                        {formatCurrency(category.amount)} ({category.percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className={`bg-gradient-to-r ${gradients[index % gradients.length]} h-3 rounded-full shadow-lg transition-all duration-500`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recent Expenses */}
          <Card title="🕒 Recent Expenses" variant="glass">
            <div className="space-y-3">
              {stats.recentExpenses.slice(0, 5).map((expense) => (
                <div
                  key={expense.id}
                  className="flex justify-between items-start p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                >
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      {expense.description}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {expense.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900 dark:text-slate-100 text-lg">
                      {formatCurrency(expense.amount)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/expenses"
              className="block mt-4 text-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold hover:scale-105 transition-transform duration-200"
            >
              View All Expenses →
            </Link>
          </Card>
        </div>

        {/* Monthly Trend */}
        <Card title="📈 Monthly Trend" variant="glass">
          <div className="space-y-3">
            {stats.monthlyTrend.map((month) => (
              <div
                key={month.month}
                className="flex justify-between items-center p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:shadow-md hover:scale-[1.01] transition-all duration-200"
              >
                <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                  {month.month}
                </span>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-semibold">
                    {month.count} expenses
                  </span>
                  <span className="font-black text-slate-900 dark:text-slate-100 text-lg">
                    {formatCurrency(month.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
