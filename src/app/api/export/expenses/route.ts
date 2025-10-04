import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ExpenseModel from "@/models/Expense";

// GET /api/export/expenses - Export expenses as CSV
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";
    const category = searchParams.get("category");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (category) query.category = category;
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = dateFrom;
      if (dateTo) query.date.$lte = dateTo;
    }

    const expenses = await ExpenseModel.find(query).sort({ date: -1 }).lean();

    if (format === "csv") {
      // Generate CSV
      const csvHeaders =
        "ID,Date,Description,Category,Amount,Payment Method,Status,Tags\n";
      const csvRows = expenses
        .map((exp) => {
          const tags = exp.tags?.join(";") || "";
          return `${exp.id},"${exp.date}","${exp.description}","${exp.category}",${exp.amount},"${exp.paymentMethod}","${exp.status}","${tags}"`;
        })
        .join("\n");

      const csv = csvHeaders + csvRows;

      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="expenses-${
            new Date().toISOString().split("T")[0]
          }.csv"`,
        },
      });
    } else if (format === "json") {
      return NextResponse.json({
        success: true,
        data: expenses,
        count: expenses.length,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid format. Use csv or json",
      },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to export expenses",
      },
      { status: 500 }
    );
  }
}
