"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/expenses", label: "Expenses", icon: "💰" },
    { href: "/budgets", label: "Budgets", icon: "🎯" },
    { href: "/analytics", label: "Analytics", icon: "📈" },
    ...(session?.user?.role === "admin"
      ? [
          { href: "/admin/users", label: "Users", icon: "👥" },
          { href: "/admin/approval-rules", label: "Rules", icon: "⚙️" },
        ]
      : []),
    ...(session?.user?.role === "manager" || session?.user?.role === "admin"
      ? [{ href: "/approvals", label: "Approvals", icon: "✓" }]
      : []),
    { href: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-black border-b-2 border-gray-300 dark:border-gray-700 shadow-lg">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo Section - Fixed Width */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 flex-shrink-0">
                <span className="text-white font-black text-xl">💸</span>
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <h1 className="text-base font-black text-black dark:text-white tracking-tight">
                  ExpenseTracker
                </h1>
                <p className="text-[9px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-0.5">
                  Pro Edition
                </p>
              </div>
            </Link>
          </div>
            
          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center justify-center flex-1 gap-1 px-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 whitespace-nowrap",
                  pathname === link.href
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
                )}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Section - User Menu & Mobile Toggle - Fixed Width */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {status === "loading" ? (
              <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                <span className="hidden sm:inline">Loading...</span>
              </div>
            ) : session ? (
              <>
                {/* User Info - Desktop Only */}
                <div className="hidden lg:flex items-center gap-3">
                  <div className="flex flex-col items-end leading-tight">
                    <span className="text-sm font-black text-black dark:text-white whitespace-nowrap">
                      {session.user.name}
                    </span>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400 capitalize">
                      {session.user.role}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                    className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 whitespace-nowrap"
                  >
                    Sign Out
                  </button>
                </div>

                {/* Mobile/Tablet Sign Out Button */}
                <button
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                  className="lg:hidden px-3 py-2 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Sign Out</span>
                  <span className="sm:hidden">Out</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-3 py-2 rounded-lg text-sm font-bold text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200 whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">In</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Join</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t-2 border-gray-300 dark:border-gray-700 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-bold transition-all duration-200",
                  pathname === link.href
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
                )}
              >
                <span className="text-xl">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            
            {/* Mobile User Info */}
            {session && (
              <div className="md:hidden mt-4 pt-4 border-t-2 border-gray-300 dark:border-gray-700 px-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-black text-lg">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-black dark:text-white">
                      {session.user.name}
                    </p>
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400 capitalize">
                      {session.user.role}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
