import mongoose, { Schema, Model } from "mongoose";
import { Expense } from "@/types";

// Mongoose schema for Expense
const ExpenseSchema = new Schema<Expense>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true }, // Owner of the expense
    companyId: { type: String, required: true }, // Company the user belongs to
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" }, // Original currency
    currencySymbol: { type: String, default: "₹" },
    convertedAmount: { type: Number }, // Amount in company currency
    companyCurrency: { type: String }, // Company's base currency
    exchangeRate: { type: Number },
    conversionDate: { type: Date },
    category: {
      type: String,
      required: true,
      enum: [
        "Food",
        "Transportation",
        "Utilities",
        "Entertainment",
        "Healthcare",
        "Shopping",
        "Travel",
        "Education",
        "Other",
      ],
    },
    description: { type: String, required: true },
    date: { type: String, required: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: [
        "Cash",
        "Credit Card",
        "Debit Card",
        "UPI",
        "Bank Transfer",
        "Other",
      ],
    },
    status: {
      type: String,
      required: true,
      default: "Draft",
      enum: ["Draft", "Submitted", "Waiting Approval", "Approved", "Rejected"],
    },
    approvals: [
      {
        approverId: String,
        order: Number, // For sequential approval
        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
          default: "Pending",
        },
        comment: String,
        approvedAt: Date,
      },
    ],
    isManagerApproverRequired: { type: Boolean, default: false },
    submittedAt: { type: Date },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    receiptUrl: { type: String },
    tags: [{ type: String }],
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  {
    timestamps: false, // We're managing timestamps manually
  }
);

// Ensure indexes
ExpenseSchema.index({ id: 1 }, { unique: true });
ExpenseSchema.index({ userId: 1 });
ExpenseSchema.index({ companyId: 1 });
ExpenseSchema.index({ status: 1 });

// Delete existing model to force re-compilation
if (mongoose.models.Expense) {
  delete mongoose.models.Expense;
}

const ExpenseModel: Model<Expense> = mongoose.model<Expense>(
  "Expense",
  ExpenseSchema
);

export default ExpenseModel;
