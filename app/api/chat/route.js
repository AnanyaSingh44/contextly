import { NextResponse } from "next/server";
import { chatWithRAG } from "@/rag/chat.js";

export const runtime = "nodejs";

export async function POST(req) {
  try {
const { query, activeSources } = await req.json();
const sourceIds = activeSources?.map(s => s.sourceId) ?? [];

    if (!query) {
      return NextResponse.json(
        { error: "Query required" },
        { status: 400 }
      );
    }

    // chatWithRAG already returns { answer, sources }
    const result = await chatWithRAG({
      userQuery: query,
      sourceIds,
    });

    // console.log(result);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Chat failed" },
      { status: 500 }
    );
  }
}
