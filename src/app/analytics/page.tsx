"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Loading } from "@/components/Loading";
import { formatCurrency } from "@/lib/utils";
import { AnalyticsData } from "@/types";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics");
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!analytics) return <div>Failed to load analytics</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">
              Total Spent
            </span>
            <span className="text-2xl font-bold text-gray-900 mt-2">
              {formatCurrency(analytics.overview.totalSpent)}
            </span>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">
              Avg. Daily
            </span>
            <span className="text-2xl font-bold text-gray-900 mt-2">
              {formatCurrency(analytics.overview.averageDaily)}
            </span>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">
              Avg. Monthly
            </span>
            <span className="text-2xl font-bold text-gray-900 mt-2">
              {formatCurrency(analytics.overview.averageMonthly)}
            </span>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">
              Top Category
            </span>
            <span className="text-2xl font-bold text-gray-900 mt-2">
              {analytics.overview.topCategory}
            </span>
          </div>
        </Card>
      </div>

      {/* Category Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Spending by Category">
          <div className="space-y-4">
            {analytics.categoryAnalysis.map((category) => (
              <div key={category.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{category.category}</span>
                  <div className="text-right">
                    <span className="text-gray-900 font-semibold">
                      {formatCurrency(category.amount)}
                    </span>
                    <span className="text-gray-500 ml-2">
                      ({category.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {category.count} transactions
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Payment Method Analysis */}
        <Card title="Payment Methods">
          <div className="space-y-4">
            {analytics.paymentMethodAnalysis.map((method) => {
              const total = analytics.overview.totalSpent;
              const percentage = (method.amount / total) * 100;

              return (
                <div
                  key={method.method}
                  className="border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        {method.method}
                      </p>
                      <p className="text-sm text-gray-500">
                        {method.count} transactions
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(method.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Daily Spending */}
      <Card title="Recent Daily Spending">
        <div className="space-y-2">
          {analytics.timeAnalysis.daily.slice(-10).map((day) => (
            <div
              key={day.date}
              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
            >
              <span className="text-sm text-gray-600">
                {new Date(day.date).toLocaleDateString("en-IN", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(day.amount)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
