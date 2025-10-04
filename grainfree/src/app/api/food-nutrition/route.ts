import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({});

  const res = await fetch(
    `https://api.spoonacular.com/food/ingredients/${id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}&amount=1`
  );

  const data = await res.json();
  return NextResponse.json(data);
}
