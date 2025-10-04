/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import UserModel from "@/models/User";

// PATCH /api/admin/users/:id - Update user
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
    const { role, managerId } = await request.json();

    await dbConnect();

    // Find user in same company
    const user = await UserModel.findOne({
      id,
      companyId: session.user.companyId,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent admin from changing their own role
    if (user.id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot modify your own account" },
        { status: 400 }
      );
    }

    // Update role if provided
    if (role && ["employee", "manager"].includes(role)) {
      user.role = role;
    }

    // Update manager if provided
    if (managerId !== undefined) {
      if (managerId) {
        // Verify manager exists
        const manager = await UserModel.findOne({
          id: managerId,
          companyId: session.user.companyId,
          role: "manager",
          isActive: true,
        });

        if (!manager) {
          return NextResponse.json(
            { error: "Manager not found or invalid" },
            { status: 400 }
          );
        }
        user.managerId = managerId;
      } else {
        user.managerId = null as any;
      }
    }

    user.updatedAt = new Date() as any;
    await user.save();

    const userResponse = user.toObject();
    // @ts-expect-error
    delete userResponse.password;

    return NextResponse.json(
      { message: "User updated successfully", user: userResponse },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/:id - Deactivate user
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

    const user = await UserModel.findOne({
      id,
      companyId: session.user.companyId,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent admin from deactivating themselves
    if (user.id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot deactivate your own account" },
        { status: 400 }
      );
    }

    user.isActive = false;
    user.updatedAt = new Date() as any;
    await user.save();

    return NextResponse.json(
      { message: "User deactivated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deactivating user:", error);
    return NextResponse.json(
      { error: "Failed to deactivate user" },
      { status: 500 }
    );
  }
}
