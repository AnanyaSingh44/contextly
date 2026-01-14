import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";
import { indexPDF } from "@/rag/pdfIndexing";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: " file required" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // TEMP directory (safe)
    const tempDir = path.join(process.cwd(), ".tmp");
    await mkdir(tempDir, { recursive: true });

    const tempPath = path.join(tempDir, `${Date.now()}-${file.name}`);

    // 1️⃣ Write temporarily
    await writeFile(tempPath, buffer);

    const sourceId = `pdf_${randomUUID()}`;

    // 2️⃣ Index PDF → embeddings stored
    await indexPDF(tempPath, sourceId);

    // 3️⃣ DELETE PDF immediately 🔥
    await unlink(tempPath);

    return NextResponse.json({
      message: "PDF indexed (file deleted)",
      sourceId,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "PDF indexing failed" },
      { status: 500 }
    );
  }
}
