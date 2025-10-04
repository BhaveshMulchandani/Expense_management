"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-violet-50 dark:from-black dark:via-gray-900 dark:to-black">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold">
              ✨ Smart Financial Management
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-slate-100 mb-6 tracking-tight">
            Track Expenses
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Effortlessly
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
            Modern expense management with powerful analytics, real-time budgeting, and intelligent approval workflows
            {session && (
              <span className="block mt-3 text-indigo-600 dark:text-indigo-400 font-bold">
                👋 Welcome back, {session.user.name}!
              </span>
            )}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/dashboard">
              <Button size="lg" variant="gradient">
                🚀 Get Started
              </Button>
            </Link>
            <Link href="/expenses">
              <Button size="lg" variant="outline">
                📊 View Expenses
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <Card variant="gradient" hover className="text-center">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">
              Visual Dashboard
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Get comprehensive insights with beautiful charts and real-time analytics
            </p>
          </Card>

          <Card variant="gradient" hover className="text-center">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">
              Smart Tracking
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Add, categorize, and manage expenses with intelligent automation
            </p>
          </Card>

          <Card variant="gradient" hover className="text-center">
            <div className="text-5xl mb-4">📈</div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">
              Deep Analytics
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Analyze spending patterns and make data-driven financial decisions
            </p>
          </Card>
        </div>

        {/* Features List */}
        <Card 
          title="✨ Powerful Features" 
          subtitle="Everything you need to manage expenses like a pro"
          className="max-w-5xl mx-auto"
          variant="glass"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div className="flex items-start gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-xl font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-bold mb-2 text-slate-900 dark:text-slate-100">
                  Multi-Category Support
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Organize expenses across multiple categories with custom tags
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-xl font-bold">💳</span>
              </div>
              <div>
                <h4 className="font-bold mb-2 text-slate-900 dark:text-slate-100">
                  Payment Methods
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Track expenses across cash, cards, and digital payments
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-xl font-bold">📊</span>
              </div>
              <div>
                <h4 className="font-bold mb-2 text-slate-900 dark:text-slate-100">
                  Visual Reports
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Beautiful charts and graphs to visualize spending trends
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-xl font-bold">⚡</span>
              </div>
              <div>
                <h4 className="font-bold mb-2 text-slate-900 dark:text-slate-100">
                  Fast & Intuitive
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Lightning-fast interface with seamless user experience
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-xl font-bold">🎯</span>
              </div>
              <div>
                <h4 className="font-bold mb-2 text-slate-900 dark:text-slate-100">
                  Budget Alerts
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Get notified when you&apos;re approaching budget limits
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-xl font-bold">🔒</span>
              </div>
              <div>
                <h4 className="font-bold mb-2 text-slate-900 dark:text-slate-100">
                  Secure & Private
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Enterprise-grade security with role-based access control
                </p>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
