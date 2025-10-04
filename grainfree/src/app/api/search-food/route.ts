import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) return NextResponse.json({ results: [] });

  const res = await fetch(
    `https://api.spoonacular.com/food/ingredients/search?apiKey=${process.env.SPOONACULAR_API_KEY}&query=${encodeURIComponent(
      query
    )}&number=10`
  );

  const data = await res.json();
  return NextResponse.json({ results: data.results || [] });
}
