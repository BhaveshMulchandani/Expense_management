"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">You need to be logged in to view this page.</p>
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="text-lg">{session.user.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-lg">{session.user.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Role</label>
            <p className="text-lg capitalize">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  session.user.role === "admin"
                    ? "bg-purple-100 text-purple-800"
                    : session.user.role === "manager"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {session.user.role}
              </span>
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">User ID</label>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded">
              {session.user.id}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Company ID
            </label>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded">
              {session.user.companyId}
            </p>
          </div>

          {session.user.managerId && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Manager ID
              </label>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                {session.user.managerId}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Role Permissions</h2>
          <ul className="space-y-2 text-sm">
            {session.user.role === "admin" && (
              <>
                <li>✅ Create and manage users</li>
                <li>✅ Configure approval rules</li>
                <li>✅ View all company expenses</li>
                <li>✅ Override approvals</li>
              </>
            )}
            {session.user.role === "manager" && (
              <>
                <li>✅ Create own expenses</li>
                <li>✅ Approve/reject team expenses</li>
                <li>✅ View team member expenses</li>
                <li>✅ Add approval comments</li>
              </>
            )}
            {session.user.role === "employee" && (
              <>
                <li>✅ Create and submit expenses</li>
                <li>✅ Upload receipts</li>
                <li>✅ Track expense status</li>
                <li>✅ View personal analytics</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
