"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Loading } from "@/components/Loading";
import {
  Expense,
  ExpenseFormData,
  ExpenseCategory,
  PaymentMethod,
} from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: 0,
    category: "Food",
    description: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "Cash",
  });

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

  const paymentMethods: PaymentMethod[] = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "UPI",
    "Bank Transfer",
    "Other",
  ];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/expenses");
      const data = await response.json();
      if (data.success) {
        setExpenses(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/expenses/${editingId}` : "/api/expenses";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchExpenses();
        resetForm();
      }
    } catch (error) {
      console.error("Failed to save expense:", error);
    }
  };

  const handleEdit = (expense: Expense) => {
    setFormData({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
      paymentMethod: expense.paymentMethod,
    });
    setEditingId(expense.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const response = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (data.success) {
        await fetchExpenses();
      }
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  const handleSubmitForApproval = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}/submit`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Expense submitted for approval!");
        await fetchExpenses();
      } else {
        alert(data.error || "Failed to submit expense");
      }
    } catch (error) {
      console.error("Failed to submit expense:", error);
      alert("Failed to submit expense for approval");
    }
  };

  const resetForm = () => {
    setFormData({
      amount: 0,
      category: "Food",
      description: "",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "Cash",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/export/expenses?format=csv");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `expenses-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to export expenses:", error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            Export CSV
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Add Expense"}
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card
          className="mb-8"
          title={editingId ? "Edit Expense" : "Add New Expense"}
        >
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Input
              type="number"
              label="Amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: parseFloat(e.target.value) })
              }
              required
              min="0"
              step="0.01"
            />

            <Select
              label="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as ExpenseCategory,
                })
              }
              options={categories.map((c) => ({ value: c, label: c }))}
              required
            />

            <Input
              type="text"
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              className="md:col-span-2"
            />

            <Input
              type="date"
              label="Date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />

            <Select
              label="Payment Method"
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentMethod: e.target.value as PaymentMethod,
                })
              }
              options={paymentMethods.map((m) => ({ value: m, label: m }))}
              required
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Receipt (Optional)
              </label>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // For now, just store the filename
                    // In production, upload to cloud storage and store URL
                    setFormData({ ...formData, receiptUrl: file.name });
                  }
                }}
              />
              {formData.receiptUrl && (
                <p className="text-sm text-gray-600 mt-1">
                  Uploaded: {formData.receiptUrl}
                </p>
              )}
            </div>

            <div className="md:col-span-2 flex gap-4">
              <Button type="submit" className="flex-1">
                {editingId ? "Update Expense" : "Add Expense"}
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Expenses List */}
      <Card title="All Expenses">
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No expenses found. Add your first expense!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => {
                  const getStatusBadge = (status: string) => {
                    const colors = {
                      Pending: "bg-yellow-100 text-yellow-800",
                      Approved: "bg-green-100 text-green-800",
                      Rejected: "bg-red-100 text-red-800",
                    };
                    return (
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          colors[status as keyof typeof colors] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {status}
                      </span>
                    );
                  };

                  return (
                    <tr key={expense.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {expense.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {expense.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(expense.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {expense.status === "Draft" && (
                          <button
                            onClick={() => handleSubmitForApproval(expense.id)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Submit for Approval
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(expense)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          disabled={expense.status !== "Draft"}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={expense.status !== "Draft"}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
