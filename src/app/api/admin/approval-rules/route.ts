import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import ApprovalRuleModel from "@/models/ApprovalRule";
import { v4 as uuidv4 } from "uuid";

// GET /api/admin/approval-rules - List all approval rules
export async function GET() {
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

    await dbConnect();

    const rules = await ApprovalRuleModel.find({
      companyId: session.user.companyId,
      isActive: true,
    })
      .sort({ minAmount: 1 })
      .lean();

    return NextResponse.json({ rules }, { status: 200 });
  } catch (error) {
    console.error("Error fetching approval rules:", error);
    return NextResponse.json(
      { error: "Failed to fetch approval rules" },
      { status: 500 }
    );
  }
}

// POST /api/admin/approval-rules - Create approval rule
export async function POST(request: NextRequest) {
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

    const {
      name,
      description,
      minAmount,
      maxAmount,
      approvers,
      isManagerApproverRequired,
      isSequential,
      minApprovalPercentage,
      specificApproverRule,
      categories,
    } = await request.json();

    // Validate required fields
    if (
      !name ||
      minAmount === undefined ||
      !approvers ||
      approvers.length === 0
    ) {
      return NextResponse.json(
        { error: "Name, minAmount, and at least one approver are required" },
        { status: 400 }
      );
    }

    // Validate percentage
    if (minApprovalPercentage < 1 || minApprovalPercentage > 100) {
      return NextResponse.json(
        { error: "Approval percentage must be between 1 and 100" },
        { status: 400 }
      );
    }

    await dbConnect();

    const newRule = new ApprovalRuleModel({
      id: uuidv4(),
      companyId: session.user.companyId,
      name,
      description: description || "",
      minAmount: minAmount || 0,
      maxAmount: maxAmount || null,
      approvers: approvers.map((a: { userId: string }, index: number) => ({
        userId: a.userId,
        order: index + 1,
      })),
      isManagerApproverRequired: isManagerApproverRequired ?? true,
      isSequential: isSequential ?? false,
      minApprovalPercentage: minApprovalPercentage || 100,
      specificApproverRule: specificApproverRule || { enabled: false },
      categories: categories || [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await newRule.save();

    return NextResponse.json(
      { message: "Approval rule created successfully", rule: newRule },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating approval rule:", error);
    return NextResponse.json(
      { error: "Failed to create approval rule" },
      { status: 500 }
    );
  }
}
