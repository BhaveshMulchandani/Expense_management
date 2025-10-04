// Core type definitions for Expense Management System

// User & Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "employee" | "manager" | "admin";
  companyId: string;
  managerId?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: "employee" | "manager" | "admin";
  companyName?: string; // For admin signup
  currency?: string; // For admin signup
}

// Company Types
export interface Company {
  id: string;
  name: string;
  currency: string;
  adminId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Approval Types
export interface ApprovalRule {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  minAmount: number;
  maxAmount: number | null;
  approvers: Array<{
    userId: string;
    order: number;
  }>;
  isManagerApproverRequired: boolean;
  isSequential: boolean;
  minApprovalPercentage: number;
  specificApproverRule?: {
    enabled: boolean;
    approverId?: string;
  };
  categories: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseApproval {
  approverId: string;
  order?: number;
  status: "Pending" | "Approved" | "Rejected";
  comment?: string;
  approvedAt?: Date;
}

export interface Expense {
  id: string;
  userId: string;
  companyId: string;
  amount: number;
  currency?: string;
  currencySymbol?: string;
  convertedAmount?: number;
  companyCurrency?: string;
  exchangeRate?: number;
  conversionDate?: Date;
  category: ExpenseCategory;
  description: string;
  date: string;
  paymentMethod: PaymentMethod;
  status: ExpenseStatus;
  approvals?: ExpenseApproval[];
  isManagerApproverRequired?: boolean;
  submittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  receiptUrl?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory =
  | "Food"
  | "Transportation"
  | "Utilities"
  | "Entertainment"
  | "Healthcare"
  | "Shopping"
  | "Travel"
  | "Education"
  | "Other";

export type PaymentMethod =
  | "Cash"
  | "Credit Card"
  | "Debit Card"
  | "UPI"
  | "Bank Transfer"
  | "Other";

export type ExpenseStatus =
  | "Draft"
  | "Submitted"
  | "Waiting Approval"
  | "Approved"
  | "Rejected";

export interface ExpenseFormData {
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  paymentMethod: PaymentMethod;
  receiptUrl?: string;
  tags?: string[];
}

export interface ExpenseFilters {
  category?: ExpenseCategory;
  paymentMethod?: PaymentMethod;
  status?: ExpenseStatus;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface DashboardStats {
  totalExpenses: number;
  monthlyTotal: number;
  categoryBreakdown: CategoryBreakdown[];
  recentExpenses: Expense[];
  monthlyTrend: MonthlyTrend[];
}

export interface CategoryBreakdown {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  count: number;
}

export interface MonthlyTrend {
  month: string;
  amount: number;
  count: number;
}

export interface AnalyticsData {
  overview: {
    totalSpent: number;
    averageDaily: number;
    averageMonthly: number;
    topCategory: ExpenseCategory;
  };
  categoryAnalysis: CategoryBreakdown[];
  timeAnalysis: {
    daily: { date: string; amount: number }[];
    weekly: { week: string; amount: number }[];
    monthly: MonthlyTrend[];
  };
  paymentMethodAnalysis: {
    method: PaymentMethod;
    amount: number;
    count: number;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Budget Management Types
export interface Budget {
  id: string;
  category: ExpenseCategory;
  amount: number;
  period: "monthly" | "yearly";
  startDate: string;
  endDate?: string;
  alertThreshold: number; // percentage (e.g., 80 means alert at 80%)
  createdAt: string;
  updatedAt: string;
  // Calculated fields (populated by API)
  spent?: number;
  remaining?: number;
  percentage?: number;
  isExceeded?: boolean;
  shouldAlert?: boolean;
}

export interface BudgetStatus {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  isExceeded: boolean;
  shouldAlert: boolean;
}

export interface BudgetFormData {
  category: ExpenseCategory;
  amount: number;
  period: "monthly" | "yearly";
  startDate: string;
  endDate?: string;
  alertThreshold: number;
}
