"use client";

import { useState } from "react";

interface SubmitExpenseButtonProps {
  expenseId: string;
  status: string;
  onSubmitted: () => void;
}

export function SubmitExpenseButton({
  expenseId,
  status,
  onSubmitted,
}: SubmitExpenseButtonProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (
      !confirm("Are you sure you want to submit this expense for approval?")
    ) {
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/expenses/${expenseId}/submit`, {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        alert("Expense submitted for approval!");
        onSubmitted();
      } else {
        alert(data.error || "Failed to submit expense");
      }
    } catch (error) {
      console.error("Error submitting expense:", error);
      alert("Failed to submit expense");
    } finally {
      setSubmitting(false);
    }
  };

  if (status !== "Draft") {
    return null;
  }

  return (
    <button
      onClick={handleSubmit}
      disabled={submitting}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
    >
      {submitting ? "Submitting..." : "Submit for Approval"}
    </button>
  );
}
