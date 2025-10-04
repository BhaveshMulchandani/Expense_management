"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Expense Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Track, manage, and analyze your expenses with ease
            {session && (
              <span className="block mt-2 text-blue-600 font-semibold">
                Welcome back, {session.user.name}!
              </span>
            )}
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/expenses">
              <Button size="lg" variant="outline">
                View Expenses
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
            <p className="text-gray-600">
              Get a comprehensive overview of your expenses with visual
              analytics
            </p>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Expense Tracking</h3>
            <p className="text-gray-600">
              Add, edit, and manage all your expenses in one place
            </p>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600">
              Analyze spending patterns and make informed financial decisions
            </p>
          </Card>
        </div>

        {/* Features List */}
        <Card title="Key Features" className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <h4 className="font-semibold mb-1">Multiple Categories</h4>
                <p className="text-sm text-gray-600">
                  Organize expenses by category
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <h4 className="font-semibold mb-1">Payment Methods</h4>
                <p className="text-sm text-gray-600">
                  Track different payment types
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <h4 className="font-semibold mb-1">Visual Reports</h4>
                <p className="text-sm text-gray-600">
                  See spending trends at a glance
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <h4 className="font-semibold mb-1">Easy Management</h4>
                <p className="text-sm text-gray-600">
                  Add, edit, or delete expenses easily
                </p>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
