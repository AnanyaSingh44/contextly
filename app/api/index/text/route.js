import { NextResponse } from "next/server";
import { textIndexing } from "@/rag/textIndexing";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // generate unique sourceId
    const sourceId = randomUUID();

    // index text
    await textIndexing(text, sourceId);

    // return sourceId so UI can add to activeSources
    return NextResponse.json({ sourceId });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Text indexing failed" },
      { status: 500 }
    );
  }
}
