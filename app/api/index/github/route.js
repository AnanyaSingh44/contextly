import { NextResponse } from "next/server";
import { randomUUID } from "crypto"
import { githubIndexing } from "@/rag/githubIndexing";

export const runtime = "nodejs";
export const maxDuration = 300; 

export async function POST(req)
{
    try{
        const {url}= await req.json();
      if (!url || !url.startsWith("https://github.com/")) {
      return NextResponse.json(
        { error: "Invalid GitHub repository URL" },
        { status: 400 }
      );
    }

        const sourceId = `github_${randomUUID()}`;
        await githubIndexing(url,sourceId);
          return NextResponse.json({
      message: "Repositories indexed successfully",
      sourceId,
    });

    }
     catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Website indexing failed" },
      { status: 500 }
    );
  }
}