import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// GET /api/admin/users - List all users in company
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can access this endpoint
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();

    // Get all users in the same company
    const users = await UserModel.find({
      companyId: session.user.companyId,
      isActive: true,
    })
      .select("-password")
      .lean();

    // Get manager names for employees
    const usersWithManagerNames = await Promise.all(
      users.map(async (user) => {
        if (user.managerId) {
          const manager = await UserModel.findOne({ id: user.managerId })
            .select("name")
            .lean();
          return {
            ...user,
            managerName: Array.isArray(manager)
              ? "Unknown"
              : manager?.name || "Unknown",
          };
        }
        return { ...user, managerName: null };
      })
    );

    return NextResponse.json({ users: usersWithManagerNames }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create new employee or manager
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    console.log("Full session object:", JSON.stringify(session, null, 2));

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can create users
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { name, email, password, role, managerId } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["employee", "manager"].includes(role)) {
      return NextResponse.json(
        { error: "Role must be 'employee' or 'manager'" },
        { status: 400 }
      );
    }

    // Debug log
    console.log("Creating user with role:", role, "Type:", typeof role);
    console.log("Session user:", session.user);
    console.log("Company ID from session:", session.user.companyId);

    // Validate companyId exists
    if (!session.user.companyId) {
      return NextResponse.json(
        { error: "Company ID not found in session. Please re-login." },
        { status: 400 }
      );
    }

    // If creating employee, managerId is required
    if (role === "employee" && !managerId) {
      return NextResponse.json(
        { error: "Manager ID is required for employees" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Verify manager exists if provided
    if (managerId) {
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
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new UserModel({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role,
      companyId: session.user.companyId,
      managerId: role === "employee" ? managerId : null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await newUser.save();

    // Return user without password
    const userResponse = newUser.toObject() as Omit<
      typeof newUser,
      "password"
    > & { password?: string };
    delete userResponse.password;

    return NextResponse.json(
      { message: "User created successfully", user: userResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
