import mongoose, { Schema, Model } from "mongoose";
import { Budget } from "@/types";

// Mongoose schema for Budget
const BudgetSchema = new Schema<Budget>(
  {
    id: { type: String, required: true, unique: true },
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
    amount: { type: Number, required: true },
    period: {
      type: String,
      required: true,
      enum: ["monthly", "yearly"],
    },
    startDate: { type: String, required: true },
    endDate: { type: String },
    alertThreshold: { type: Number, required: true, default: 80 },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  {
    timestamps: false,
  }
);

// Create or retrieve the model
const BudgetModel: Model<Budget> =
  mongoose.models.Budget || mongoose.model<Budget>("Budget", BudgetSchema);

export default BudgetModel;
