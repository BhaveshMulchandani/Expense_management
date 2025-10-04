import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CompanyModel from "@/models/Company";

export async function GET() {
  try {
    await connectDB();

    // Get all active companies
    const companies = await CompanyModel.find({ isActive: true })
      .select("id name currency")
      .sort({ name: 1 });

    return NextResponse.json({
      companies: companies.map((company) => ({
        id: company.id,
        name: company.name,
        currency: company.currency,
      })),
    });
  } catch (error) {
    console.error("Get companies error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
