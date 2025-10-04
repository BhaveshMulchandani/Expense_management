import { NextResponse } from "next/server";

interface CountryData {
  name: { common: string };
  currencies?: Record<string, { name: string; symbol: string }>;
}

interface ProcessedCountry {
  name: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
}

export async function GET() {
  try {
    // Fetch countries and currencies from REST Countries API
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,currencies"
    );
    const data: CountryData[] = await response.json();

    // Process and structure the data
    const countries = data
      .map((country) => {
        const currencies = country.currencies || {};
        const currencyCode = Object.keys(currencies)[0] || "";
        const currencyName = currencies[currencyCode]?.name || "";
        const currencySymbol = currencies[currencyCode]?.symbol || "";

        return {
          name: country.name.common,
          currencyCode,
          currencyName,
          currencySymbol,
        };
      })
      .filter((c: ProcessedCountry) => c.currencyCode) // Filter out countries without currency
      .sort((a: ProcessedCountry, b: ProcessedCountry) =>
        a.name.localeCompare(b.name)
      ); // Sort alphabetically

    return NextResponse.json({ countries });
  } catch (error) {
    console.error("Fetch countries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch countries" },
      { status: 500 }
    );
  }
}
