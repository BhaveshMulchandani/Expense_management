import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import ExpenseModel from "@/models/Expense";

// POST /api/approvals/:expenseId/reject - Reject expense
export async function POST(
  request: NextRequest,
  { params }: { params: { expenseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "employee") {
      return NextResponse.json(
        { error: "Forbidden - Only managers can reject expenses" },
        { status: 403 }
      );
    }

    const { expenseId } = params;
    const { comment } = await request.json();

    if (!comment || comment.trim() === "") {
      return NextResponse.json(
        { error: "Comment is required when rejecting an expense" },
        { status: 400 }
      );
    }

    await dbConnect();

    const expense = await ExpenseModel.findOne({
      id: expenseId,
      companyId: session.user.companyId,
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    if (!["Submitted", "Waiting Approval"].includes(expense.status)) {
      return NextResponse.json(
        { error: "Expense is not pending approval" },
        { status: 400 }
      );
    }

    // Find this approver's approval
    const approvalIndex = expense.approvals?.findIndex(
      (a) => a.approverId === session.user.id && a.status === "Pending"
    );

    if (approvalIndex === -1 || approvalIndex === undefined) {
      return NextResponse.json(
        { error: "You are not authorized to reject this expense" },
        { status: 403 }
      );
    }

    // Update approval status
    if (expense.approvals) {
      expense.approvals[approvalIndex].status = "Rejected";
      expense.approvals[approvalIndex].comment = comment;
      expense.approvals[approvalIndex].approvedAt = new Date();
    }

    // Reject entire expense (one rejection = full rejection)
    expense.status = "Rejected";
    expense.rejectedAt = new Date();
    expense.updatedAt = new Date().toISOString();

    await expense.save();

    return NextResponse.json(
      { message: "Expense rejected successfully", expense },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error rejecting expense:", error);
    return NextResponse.json(
      { error: "Failed to reject expense" },
      { status: 500 }
    );
  }
}
