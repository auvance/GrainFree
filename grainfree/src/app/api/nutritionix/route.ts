// src/app/api/nutritionix/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { query } = await req.json();
  try {
    const res = await fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-id": process.env.NUTRITIONIX_APP_ID!,
        "x-app-key": process.env.NUTRITIONIX_API_KEY!,
      },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
