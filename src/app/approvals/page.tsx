"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Expense {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency?: string;
  currencySymbol?: string;
  convertedAmount?: number;
  companyCurrency?: string;
  exchangeRate?: number;
  category: string;
  description: string;
  date: string;
  paymentMethod: string;
  status: string;
  approvals?: Array<{
    approverId: string;
    order?: number;
    status: string;
    comment?: string;
    approvedAt?: Date;
  }>;
  submittedAt?: Date;
  receiptUrl?: string;
}

export default function ApprovalsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [comment, setComment] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user?.role === "employee") {
      router.push("/dashboard");
    } else {
      fetchApprovals();
    }
  }, [status, session, router]);

  const fetchApprovals = async () => {
    try {
      const res = await fetch("/api/approvals");
      const data = await res.json();

      if (res.ok) {
        setExpenses(data.expenses);
      }
    } catch (error) {
      console.error("Error fetching approvals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (expenseId: string) => {
    try {
      const res = await fetch(`/api/approvals/${expenseId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(
          data.autoApproved
            ? "Expense auto-approved (specific approver rule)!"
            : "Expense approved successfully!"
        );
        setSelectedExpense(null);
        setComment("");
        fetchApprovals();
      } else {
        alert(data.error || "Failed to approve expense");
      }
    } catch (error) {
      console.error("Error approving expense:", error);
      alert("Failed to approve expense");
    }
  };

  const handleReject = async (expenseId: string) => {
    if (!comment.trim()) {
      alert("Please provide a comment for rejection");
      return;
    }

    try {
      const res = await fetch(`/api/approvals/${expenseId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Expense rejected successfully!");
        setSelectedExpense(null);
        setComment("");
        setActionType(null);
        fetchApprovals();
      } else {
        alert(data.error || "Failed to reject expense");
      }
    } catch (error) {
      console.error("Error rejecting expense:", error);
      alert("Failed to reject expense");
    }
  };

  const openModal = (expense: Expense, action: "approve" | "reject") => {
    setSelectedExpense(expense);
    setActionType(action);
    setComment("");
  };

  const closeModal = () => {
    setSelectedExpense(null);
    setActionType(null);
    setComment("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Pending Approvals
        </h1>

        {expenses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">
              No expenses pending your approval
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div key={expense.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {expense.userName}
                      </h3>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        {expense.status}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">
                      {expense.userEmail}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Amount</span>
                        <p className="font-semibold text-lg">
                          {expense.currencySymbol || "₹"}
                          {expense.amount.toLocaleString()}
                          {expense.currency &&
                            expense.currency !== expense.companyCurrency && (
                              <span className="text-sm text-gray-500 ml-2">
                                ({expense.currency})
                              </span>
                            )}
                        </p>
                        {expense.convertedAmount &&
                          expense.currency !== expense.companyCurrency && (
                            <p className="text-sm text-gray-600">
                              ≈ {expense.companyCurrency}{" "}
                              {expense.convertedAmount.toLocaleString()}
                            </p>
                          )}
                      </div>

                      <div>
                        <span className="text-sm text-gray-500">Category</span>
                        <p className="font-semibold">{expense.category}</p>
                      </div>

                      <div>
                        <span className="text-sm text-gray-500">Date</span>
                        <p className="font-semibold">{expense.date}</p>
                      </div>

                      <div>
                        <span className="text-sm text-gray-500">
                          Payment Method
                        </span>
                        <p className="font-semibold">{expense.paymentMethod}</p>
                      </div>

                      <div className="col-span-2">
                        <span className="text-sm text-gray-500">
                          Description
                        </span>
                        <p className="font-semibold">{expense.description}</p>
                      </div>
                    </div>

                    {/* Approval History */}
                    {expense.approvals && expense.approvals.length > 0 && (
                      <div className="mt-4 border-t pt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Approval Progress:
                        </p>
                        <div className="space-y-2">
                          {expense.approvals.map((approval, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3 text-sm"
                            >
                              <span
                                className={`w-20 px-2 py-1 rounded text-center ${
                                  approval.status === "Approved"
                                    ? "bg-green-100 text-green-800"
                                    : approval.status === "Rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {approval.status}
                              </span>
                              {approval.order && (
                                <span className="text-gray-500">
                                  Step {approval.order}
                                </span>
                              )}
                              {approval.comment && (
                                <span className="text-gray-600">
                                  - {approval.comment}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col space-y-2">
                    <button
                      onClick={() => openModal(expense, "approve")}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => openModal(expense, "reject")}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {selectedExpense && actionType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">
              {actionType === "approve" ? "Approve" : "Reject"} Expense
            </h2>

            <div className="mb-4">
              <p className="text-gray-700">
                <span className="font-semibold">Employee:</span>{" "}
                {selectedExpense.userName}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Amount:</span>{" "}
                {selectedExpense.currencySymbol || "₹"}
                {selectedExpense.amount.toLocaleString()}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Description:</span>{" "}
                {selectedExpense.description}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment {actionType === "reject" && "(Required)"}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder={
                  actionType === "reject"
                    ? "Please provide a reason for rejection"
                    : "Optional comment"
                }
                required={actionType === "reject"}
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() =>
                  actionType === "approve"
                    ? handleApprove(selectedExpense.id)
                    : handleReject(selectedExpense.id)
                }
                className={`flex-1 px-4 py-2 rounded-md text-white ${
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm {actionType === "approve" ? "Approval" : "Rejection"}
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
