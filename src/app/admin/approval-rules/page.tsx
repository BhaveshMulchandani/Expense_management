"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ApprovalRule {
  id: string;
  name: string;
  description?: string;
  minAmount: number;
  maxAmount: number | null;
  approvers: Array<{ userId: string; order: number }>;
  isManagerApproverRequired: boolean;
  isSequential: boolean;
  minApprovalPercentage: number;
  specificApproverRule?: {
    enabled: boolean;
    approverId?: string;
  };
  categories: string[];
  isActive: boolean;
}

interface User {
  id: string;
  name: string;
  role: string;
}

const CATEGORIES = [
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

export default function ApprovalRulesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rules, setRules] = useState<ApprovalRule[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minAmount: 0,
    maxAmount: null as number | null,
    approvers: [] as string[],
    isManagerApproverRequired: true,
    isSequential: false,
    minApprovalPercentage: 100,
    specificApproverEnabled: false,
    specificApproverId: "",
    categories: [] as string[],
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user?.role !== "admin") {
      router.push("/dashboard");
    } else {
      fetchRules();
      fetchUsers();
    }
  }, [status, session, router]);

  const fetchRules = async () => {
    try {
      const res = await fetch("/api/admin/approval-rules");
      const data = await res.json();

      if (res.ok) {
        setRules(data.rules);
      }
    } catch (error) {
      console.error("Error fetching rules:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();

      if (res.ok) {
        // Filter managers and admins for approvers
        const approvers = data.users.filter(
          (u: User) => u.role === "manager" || u.role === "admin"
        );
        setUsers(approvers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.approvers.length === 0) {
      alert("Please select at least one approver");
      return;
    }

    try {
      const res = await fetch("/api/admin/approval-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          minAmount: formData.minAmount,
          maxAmount: formData.maxAmount,
          approvers: formData.approvers.map((userId) => ({ userId })),
          isManagerApproverRequired: formData.isManagerApproverRequired,
          isSequential: formData.isSequential,
          minApprovalPercentage: formData.minApprovalPercentage,
          specificApproverRule: {
            enabled: formData.specificApproverEnabled,
            approverId: formData.specificApproverId,
          },
          categories: formData.categories,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Approval rule created successfully!");
        setShowCreateModal(false);
        resetForm();
        fetchRules();
      } else {
        alert(data.error || "Failed to create rule");
      }
    } catch (error) {
      console.error("Error creating rule:", error);
      alert("Failed to create rule");
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm("Are you sure you want to delete this rule?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/approval-rules/${ruleId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Rule deleted successfully!");
        fetchRules();
      } else {
        alert("Failed to delete rule");
      }
    } catch (error) {
      console.error("Error deleting rule:", error);
      alert("Failed to delete rule");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      minAmount: 0,
      maxAmount: null,
      approvers: [],
      isManagerApproverRequired: true,
      isSequential: false,
      minApprovalPercentage: 100,
      specificApproverEnabled: false,
      specificApproverId: "",
      categories: [],
    });
  };

  const toggleApprover = (userId: string) => {
    if (formData.approvers.includes(userId)) {
      setFormData({
        ...formData,
        approvers: formData.approvers.filter((id) => id !== userId),
      });
    } else {
      setFormData({
        ...formData,
        approvers: [...formData.approvers, userId],
      });
    }
  };

  const toggleCategory = (category: string) => {
    if (formData.categories.includes(category)) {
      setFormData({
        ...formData,
        categories: formData.categories.filter((c) => c !== category),
      });
    } else {
      setFormData({
        ...formData,
        categories: [...formData.categories, category],
      });
    }
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Approval Rules</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Rule
          </button>
        </div>

        {/* Rules List */}
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {rule.name}
                  </h3>
                  {rule.description && (
                    <p className="text-gray-600 mb-4">{rule.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Amount Range:</span>{" "}
                      {rule.minAmount} -{" "}
                      {rule.maxAmount ? rule.maxAmount : "No limit"}
                    </div>
                    <div>
                      <span className="font-medium">Approvers:</span>{" "}
                      {rule.approvers.length}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span>{" "}
                      {rule.isSequential ? "Sequential" : "Parallel"}
                    </div>
                    <div>
                      <span className="font-medium">Min Approval %:</span>{" "}
                      {rule.minApprovalPercentage}%
                    </div>
                    <div>
                      <span className="font-medium">Manager Required:</span>{" "}
                      {rule.isManagerApproverRequired ? "Yes" : "No"}
                    </div>
                    {rule.specificApproverRule?.enabled && (
                      <div>
                        <span className="font-medium">
                          Special Approver Rule:
                        </span>{" "}
                        Active
                      </div>
                    )}
                  </div>

                  {rule.categories.length > 0 && (
                    <div className="mt-4">
                      <span className="font-medium text-sm">Categories:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {rule.categories.map((cat) => (
                          <span
                            key={cat}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="ml-4 text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {rules.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No approval rules configured yet. Create your first rule to get
              started.
            </div>
          )}
        </div>
      </div>

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 my-8">
            <h2 className="text-2xl font-bold mb-4">Create Approval Rule</h2>
            <form onSubmit={handleCreateRule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rule Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Large Expense Approval"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Amount *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.minAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minAmount: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Amount (blank for no limit)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxAmount || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxAmount: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Approvers *
                </label>
                <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                  {users.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center space-x-2 py-1 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.approvers.includes(user.id)}
                        onChange={() => toggleApprover(user.id)}
                        className="rounded"
                      />
                      <span>
                        {user.name} ({user.role})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isManagerApproverRequired}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isManagerApproverRequired: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">
                    Require manager approval first
                  </span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isSequential}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isSequential: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">
                    Sequential approval (approvers must approve in order)
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Approval Percentage (%)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={formData.minApprovalPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minApprovalPercentage: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">
                  For parallel approval only. E.g., 60 means 60% of approvers
                  must approve
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.specificApproverEnabled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specificApproverEnabled: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">
                    Enable specific approver auto-approval
                  </span>
                </label>

                {formData.specificApproverEnabled && (
                  <select
                    value={formData.specificApproverId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specificApproverId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md ml-6"
                  >
                    <option value="">-- Select Approver --</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apply to Categories (leave empty for all)
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        formData.categories.includes(category)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Rule
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
