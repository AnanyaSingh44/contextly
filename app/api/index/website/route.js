import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { indexWebsite } from "@/rag/websiteIndexing";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL required" },
        { status: 400 }
      );
    }

    const sourceId = `web_${randomUUID()}`;

    await indexWebsite(url, sourceId);

    return NextResponse.json({
      message: "Website indexed successfully",
      sourceId,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Website indexing failed" },
      { status: 500 }
    );
  }
}
