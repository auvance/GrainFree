import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1", // 👈 important
});

export async function GET() {
  try {
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ free & fast
      messages: [
        { role: "user", content: "Write a haiku about gluten-free food." },
      ],
    });

    return NextResponse.json({
      output: response.choices[0].message?.content ?? "No output",
    });
  } catch (err: any) {
    console.error("Groq API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
