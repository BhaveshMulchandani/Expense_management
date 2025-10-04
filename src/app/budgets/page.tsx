"use client";

import { useState, useEffect } from "react";
import { Budget, BudgetFormData, ExpenseCategory } from "@/types";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Card } from "@/components/Card";
import { Loading } from "@/components/Loading";

const categories: ExpenseCategory[] = [
  "Food",
  "Transportation",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Travel",
  "Education",
  "Other",
];

const periods = ["monthly", "yearly"];

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BudgetFormData>({
    category: "Food",
    amount: 0,
    period: "monthly",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    alertThreshold: 80,
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/budgets");
      const data = await res.json();
      if (data.success) {
        setBudgets(data.data);
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/budgets/${editingId}` : "/api/budgets";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        await fetchBudgets();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving budget:", error);
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingId(budget.id);
    setFormData({
      category: budget.category,
      amount: budget.amount,
      period: budget.period,
      startDate: budget.startDate,
      endDate: budget.endDate || "",
      alertThreshold: budget.alertThreshold,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) return;

    try {
      const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        await fetchBudgets();
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      category: "Food",
      amount: 0,
      period: "monthly",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      alertThreshold: 80,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getProgressColor = (percentage: number, isExceeded: boolean) => {
    if (isExceeded) return "bg-red-500";
    if (percentage >= 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusBadge = (budget: Budget) => {
    if (budget.isExceeded) {
      return (
        <span className="px-3 py-1.5 text-xs font-bold bg-red-600 text-white dark:bg-red-500 rounded-xl shadow-md">
          🚨 Exceeded
        </span>
      );
    }
    if (budget.shouldAlert) {
      return (
        <span className="px-3 py-1.5 text-xs font-bold bg-amber-600 text-white dark:bg-amber-500 rounded-xl shadow-md">
          ⚠️ Alert
        </span>
      );
    }
    return (
      <span className="px-3 py-1.5 text-xs font-bold bg-emerald-600 text-white dark:bg-emerald-500 rounded-xl shadow-md">
        ✓ On Track
      </span>
    );
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black text-black dark:text-white tracking-tight">Budget Management</h1>
          <Button onClick={() => setShowForm(!showForm)} variant="gradient">
            {showForm ? "Cancel" : "+ Add Budget"}
          </Button>
        </div>

      {showForm && (
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Budget" : "Create New Budget"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as ExpenseCategory,
                  })
                }
                options={categories.map((cat) => ({ value: cat, label: cat }))}
                required
              />

              <Input
                type="number"
                label="Amount (₹)"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value),
                  })
                }
                min="0"
                step="0.01"
                required
              />

              <Select
                label="Period"
                value={formData.period}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    period: e.target.value as "monthly" | "yearly",
                  })
                }
                options={periods.map((period) => ({
                  value: period,
                  label: period.charAt(0).toUpperCase() + period.slice(1),
                }))}
                required
              />

              <Input
                type="number"
                label="Alert Threshold (%)"
                value={formData.alertThreshold}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    alertThreshold: parseFloat(e.target.value),
                  })
                }
                min="0"
                max="100"
                required
              />

              <Input
                type="date"
                label="Start Date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />

              <Input
                type="date"
                label="End Date (Optional)"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? "Update Budget" : "Create Budget"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => (
          <Card key={budget.id} className="relative">
            <div className="absolute top-4 right-4">
              {getStatusBadge(budget)}
            </div>

            <h3 className="text-lg font-semibold mb-2">{budget.category}</h3>
            <p className="text-sm text-gray-600 mb-4 capitalize">
              {budget.period} Budget
            </p>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>₹{budget.spent?.toLocaleString()} spent</span>
                <span>₹{budget.amount?.toLocaleString()} limit</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all ${getProgressColor(
                    budget.percentage || 0,
                    budget.isExceeded || false
                  )}`}
                  style={{ width: `${Math.min(budget.percentage || 0, 100)}%` }}
                />
              </div>

              <p className="text-sm text-gray-600 mt-1">
                {budget.percentage?.toFixed(1)}% used
              </p>

              {budget.remaining !== undefined && (
                <p
                  className={`text-sm font-semibold mt-2 ${
                    budget.isExceeded ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {budget.isExceeded ? "Over" : "Remaining"}: ₹
                  {Math.abs(budget.remaining).toLocaleString()}
                </p>
              )}
            </div>

            <div className="text-xs text-gray-500 mb-4">
              <p>
                Period: {budget.startDate}{" "}
                {budget.endDate ? `to ${budget.endDate}` : "onwards"}
              </p>
              <p>Alert at: {budget.alertThreshold}%</p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(budget)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(budget.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

        {budgets.length === 0 && !showForm && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4 font-semibold">
              No budgets found. Create your first budget to start tracking!
            </p>
            <Button onClick={() => setShowForm(true)} variant="gradient">+ Add Budget</Button>
          </div>
        )}
      </div>
    </div>
  );
}
