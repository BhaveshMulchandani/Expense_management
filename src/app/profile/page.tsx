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
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-black text-black dark:text-white mb-8 tracking-tight">Your Profile</h1>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg p-8 space-y-6 border-2 border-gray-200 dark:border-gray-700">
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Name</label>
            <p className="text-xl font-semibold text-black dark:text-white mt-1">{session.user.name}</p>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Email</label>
            <p className="text-xl font-semibold text-black dark:text-white mt-1">{session.user.email}</p>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Role</label>
            <p className="text-lg mt-2">
              <span
                className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold shadow-lg capitalize ${
                  session.user.role === "admin"
                    ? "bg-purple-600 text-white dark:bg-purple-500"
                    : session.user.role === "manager"
                    ? "bg-blue-600 text-white dark:bg-blue-500"
                    : "bg-emerald-600 text-white dark:bg-emerald-500"
                }`}
              >
                {session.user.role === "admin" && "👑 "}
                {session.user.role === "manager" && "⭐ "}
                {session.user.role === "employee" && "👤 "}
                {session.user.role}
              </span>
            </p>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">User ID</label>
            <p className="text-sm font-mono bg-white dark:bg-black border-2 border-gray-300 dark:border-gray-600 p-3 rounded-lg mt-1 text-black dark:text-white font-semibold">
              {session.user.id}
            </p>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Company ID
            </label>
            <p className="text-sm font-mono bg-white dark:bg-black border-2 border-gray-300 dark:border-gray-600 p-3 rounded-lg mt-1 text-black dark:text-white font-semibold">
              {session.user.companyId}
            </p>
          </div>

          {session.user.managerId && (
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Manager ID
              </label>
              <p className="text-sm font-mono bg-white dark:bg-black border-2 border-gray-300 dark:border-gray-600 p-3 rounded-lg mt-1 text-black dark:text-white font-semibold">
                {session.user.managerId}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-gray-800 dark:to-gray-900 border-2 border-indigo-300 dark:border-indigo-600 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-black text-black dark:text-white mb-4 flex items-center gap-2">
            🔐 Role Permissions
          </h2>
          <ul className="space-y-3 text-base font-semibold text-black dark:text-white">
            {session.user.role === "admin" && (
              <>
                <li className="flex items-center gap-2">✅ Create and manage users</li>
                <li className="flex items-center gap-2">✅ Configure approval rules</li>
                <li className="flex items-center gap-2">✅ View all company expenses</li>
                <li className="flex items-center gap-2">✅ Override approvals</li>
              </>
            )}
            {session.user.role === "manager" && (
              <>
                <li className="flex items-center gap-2">✅ Create own expenses</li>
                <li className="flex items-center gap-2">✅ Approve/reject team expenses</li>
                <li className="flex items-center gap-2">✅ View team member expenses</li>
                <li className="flex items-center gap-2">✅ Add approval comments</li>
              </>
            )}
            {session.user.role === "employee" && (
              <>
                <li className="flex items-center gap-2">✅ Create and submit expenses</li>
                <li className="flex items-center gap-2">✅ Upload receipts</li>
                <li className="flex items-center gap-2">✅ Track expense status</li>
                <li className="flex items-center gap-2">✅ View personal analytics</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
