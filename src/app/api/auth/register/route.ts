import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import CompanyModel from "@/models/Company";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      password,
      role,
      companyName,
      country,
      currency,
      currencySymbol,
      companyId,
      managerId,
    } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const userRole = role || "employee";

    // If admin signup, company name and currency are required
    if (userRole === "admin" && (!companyName || !currency)) {
      return NextResponse.json(
        { error: "Company name and currency required for admin signup" },
        { status: 400 }
      );
    }

    // For employee/manager, companyId is required
    if ((userRole === "employee" || userRole === "manager") && !companyId) {
      return NextResponse.json(
        { error: "Company ID required for employee/manager signup" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let finalCompanyId: string;

    // If admin, create new company
    if (userRole === "admin") {
      const newCompany = await CompanyModel.create({
        id: randomBytes(16).toString("hex"),
        name: companyName,
        country: country || "India",
        currency: currency || "INR",
        currencySymbol: currencySymbol || "₹",
        adminId: randomBytes(16).toString("hex"), // Temporary, will update after user creation
      });
      finalCompanyId = newCompany.id;

      // Create admin user
      const userId = randomBytes(16).toString("hex");
      const user = await UserModel.create({
        id: userId,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "admin",
        companyId: finalCompanyId,
        managerId: null,
      });

      // Update company with actual admin ID
      await CompanyModel.findOneAndUpdate(
        { id: finalCompanyId },
        { adminId: userId }
      );

      return NextResponse.json(
        {
          message: "Admin user and company created successfully",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            companyId: user.companyId,
          },
          company: {
            id: newCompany.id,
            name: newCompany.name,
            currency: newCompany.currency,
          },
        },
        { status: 201 }
      );
    } else {
      // For employee or manager, use provided companyId
      finalCompanyId = companyId;

      // Verify company exists
      const existingCompany = await CompanyModel.findOne({
        id: finalCompanyId,
      });
      if (!existingCompany) {
        return NextResponse.json(
          { error: "Company not found" },
          { status: 404 }
        );
      }

      // Create employee or manager user
      const userId = randomBytes(16).toString("hex");
      const user = await UserModel.create({
        id: userId,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: userRole,
        companyId: finalCompanyId,
        managerId: managerId || null,
      });

      return NextResponse.json(
        {
          message: `${
            userRole.charAt(0).toUpperCase() + userRole.slice(1)
          } user created successfully`,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            companyId: user.companyId,
            managerId: user.managerId,
          },
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
