import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";
import { indexPPTX } from "@/rag/pptIndexing";
export const runtime = "nodejs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "file required" },
        { status: 400 }
      );
    }

    // ❗ ensure pptx only
    const ext = path.extname(file.name).toLowerCase();
    if (ext !== ".pptx") {
      return NextResponse.json(
        { error: "Only .pptx files are supported" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // TEMP directory
    const tempDir = path.join(process.cwd(), ".tmp");
    await mkdir(tempDir, { recursive: true });

    const tempPath = path.join(
      tempDir,
      `${Date.now()}-${file.name}`
    );

    // 1️⃣ Write temporarily
    await writeFile(tempPath, buffer);

    const sourceId = `pptx_${randomUUID()}`;

    // 2️⃣ Index PPTX → embeddings stored
    await indexPPTX(tempPath, sourceId);

    // 3️⃣ DELETE PPTX immediately 🔥
    await unlink(tempPath);

    return NextResponse.json({
      message: "PPTX indexed (file deleted)",
      sourceId,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "PPTX indexing failed" },
      { status: 500 }
    );
  }
}
