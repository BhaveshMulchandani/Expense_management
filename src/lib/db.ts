// MongoDB database implementation
import { Expense } from "@/types";
import { connectDB } from "./mongodb";
import ExpenseModel from "@/models/Expense";

export const db = {
  expenses: {
    getAll: async (): Promise<Expense[]> => {
      try {
        await connectDB();
        const expenses = await ExpenseModel.find({}).sort({ date: -1 }).lean();
        return expenses.map((exp) => ({
          ...exp,
          _id: undefined, // Remove MongoDB _id field
        })) as Expense[];
      } catch (error) {
        console.error("Error fetching expenses:", error);
        throw new Error("Failed to fetch expenses from database");
      }
    },

    getById: async (id: string): Promise<Expense | null> => {
      try {
        await connectDB();
        const expense = await ExpenseModel.findOne({ id }).lean();
        if (!expense) return null;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...rest } = expense;
        return rest as Expense;
      } catch (error) {
        console.error("Error fetching expense by ID:", error);
        throw new Error("Failed to fetch expense from database");
      }
    },

    create: async (expense: Expense): Promise<Expense> => {
      try {
        await connectDB();
        const newExpense = new ExpenseModel(expense);
        await newExpense.save();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...rest } = newExpense.toObject();
        return rest as Expense;
      } catch (error) {
        console.error("Error creating expense:", error);
        throw new Error("Failed to create expense in database");
      }
    },

    update: async (
      id: string,
      updates: Partial<Expense>
    ): Promise<Expense | null> => {
      try {
        await connectDB();

        const updatedExpense = await ExpenseModel.findOneAndUpdate(
          { id },
          { ...updates, updatedAt: new Date().toISOString() },
          { new: true }
        ).lean();

        if (!updatedExpense) return null;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...rest } = updatedExpense;
        return rest as Expense;
      } catch (error) {
        console.error("Error updating expense:", error);
        throw new Error("Failed to update expense in database");
      }
    },

    delete: async (id: string): Promise<boolean> => {
      try {
        await connectDB();
        const result = await ExpenseModel.deleteOne({ id });
        return result.deletedCount > 0;
      } catch (error) {
        console.error("Error deleting expense:", error);
        throw new Error("Failed to delete expense from database");
      }
    },

    filter: async (
      filters: Record<string, string | number>
    ): Promise<Expense[]> => {
      try {
        await connectDB();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (filters.category) {
          query.category = filters.category;
        }
        if (filters.status) {
          query.status = filters.status;
        }
        if (filters.dateFrom || filters.dateTo) {
          query.date = {};
          if (filters.dateFrom) {
            query.date.$gte = filters.dateFrom;
          }
          if (filters.dateTo) {
            query.date.$lte = filters.dateTo;
          }
        }
        if (
          filters.minAmount !== undefined ||
          filters.maxAmount !== undefined
        ) {
          query.amount = {};
          if (filters.minAmount !== undefined) {
            query.amount.$gte = Number(filters.minAmount);
          }
          if (filters.maxAmount !== undefined) {
            query.amount.$lte = Number(filters.maxAmount);
          }
        }

        const expenses = await ExpenseModel.find(query)
          .sort({ date: -1 })
          .lean();
        return expenses.map((exp) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _id, ...rest } = exp;
          return rest;
        }) as Expense[];
      } catch (error) {
        console.error("Error filtering expenses:", error);
        throw new Error("Failed to filter expenses from database");
      }
    },
  },
};
