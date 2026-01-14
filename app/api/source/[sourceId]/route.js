import { NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";

export const runtime = "nodejs";

const client = new QdrantClient({
  url: "http://localhost:6333",
});

export async function DELETE(req, { params }) {
  try {
    const { sourceId } = params;

    await client.delete("chaicode-collection", {
      filter: {
        must: [
          {
            key: "metadata.sourceId",
            match: { value: sourceId },
          },
        ],
      },
    });

    return NextResponse.json({
      message: "Source deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
