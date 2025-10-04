/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import ApprovalRuleModel from "@/models/ApprovalRule";

// PATCH /api/admin/approval-rules/:id - Update approval rule
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = params;
    const updateData = await request.json();

    await dbConnect();

    const rule = await ApprovalRuleModel.findOne({
      id,
      companyId: session.user.companyId,
    });

    if (!rule) {
      return NextResponse.json(
        { error: "Approval rule not found" },
        { status: 404 }
      );
    }

    // Update fields
    const allowedFields = [
      "name",
      "minAmount",
      "maxAmount",
      "approvers",
      "isManagerApproverRequired",
      "isSequential",
      "minApprovalPercentage",
      "specificApproverRule",
      "categories",
      "isActive",
    ];

    allowedFields.forEach((key) => {
      if (key in updateData) {
        (rule as any)[key] = updateData[key];
      }
    });

    rule.updatedAt = new Date() as any;
    await rule.save();

    return NextResponse.json(
      { message: "Approval rule updated successfully", rule },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating approval rule:", error);
    return NextResponse.json(
      { error: "Failed to update approval rule" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/approval-rules/:id - Delete approval rule
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = params;

    await dbConnect();

    const rule = await ApprovalRuleModel.findOne({
      id,
      companyId: session.user.companyId,
    });

    if (!rule) {
      return NextResponse.json(
        { error: "Approval rule not found" },
        { status: 404 }
      );
    }

    rule.isActive = false;
    rule.updatedAt = new Date() as any;
    await rule.save();

    return NextResponse.json(
      { message: "Approval rule deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting approval rule:", error);
    return NextResponse.json(
      { error: "Failed to delete approval rule" },
      { status: 500 }
    );
  }
}
