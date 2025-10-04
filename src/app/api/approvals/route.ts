import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import ExpenseModel from "@/models/Expense";
import UserModel from "@/models/User";

// GET /api/approvals - Get expenses pending approval for logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only managers and admins can approve
    if (session.user.role === "employee") {
      return NextResponse.json(
        { error: "Forbidden - Only managers can approve expenses" },
        { status: 403 }
      );
    }

    await dbConnect();

    // Find all expenses where user is an approver and status is pending
    const expenses = await ExpenseModel.find({
      companyId: session.user.companyId,
      status: { $in: ["Submitted", "Waiting Approval"] },
      "approvals.approverId": session.user.id,
      "approvals.status": "Pending",
    })
      .sort({ submittedAt: -1 })
      .lean();

    // Get user details for each expense
    const expensesWithUserDetails = await Promise.all(
      expenses.map(async (expense) => {
        const user = await UserModel.findOne({ id: expense.userId }).select(
          "name email"
        );
        return {
          ...expense,
          userName: user?.name || "Unknown",
          userEmail: user?.email || "",
        };
      })
    );

    return NextResponse.json(
      { expenses: expensesWithUserDetails },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching approvals:", error);
    return NextResponse.json(
      { error: "Failed to fetch approvals" },
      { status: 500 }
    );
  }
}
