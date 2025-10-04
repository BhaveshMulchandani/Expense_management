import { NextRequest, NextResponse } from "next/server";

// GET /api/currency/convert?from=USD&to=INR&amount=100
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const amount = searchParams.get("amount");

    if (!from || !to || !amount) {
      return NextResponse.json(
        { error: "Missing required parameters: from, to, amount" },
        { status: 400 }
      );
    }

    const amountNum = parseFloat(amount);

    if (isNaN(amountNum)) {
      return NextResponse.json(
        { error: "Invalid amount value" },
        { status: 400 }
      );
    }

    // If same currency, return amount
    if (from === to) {
      return NextResponse.json(
        {
          from,
          to,
          amount: amountNum,
          convertedAmount: amountNum,
          rate: 1,
          date: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // Fetch exchange rate from API
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${from}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data = await response.json();

    if (!data.rates[to]) {
      return NextResponse.json(
        { error: `Currency ${to} not found` },
        { status: 404 }
      );
    }

    const rate = data.rates[to];
    const convertedAmount = amountNum * rate;

    return NextResponse.json(
      {
        from,
        to,
        amount: amountNum,
        convertedAmount: parseFloat(convertedAmount.toFixed(2)),
        rate: parseFloat(rate.toFixed(4)),
        date: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error converting currency:", error);
    return NextResponse.json(
      { error: "Failed to convert currency" },
      { status: 500 }
    );
  }
}
