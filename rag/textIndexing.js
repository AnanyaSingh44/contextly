import "dotenv/config";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { storeDocuments } from "@/rag/vectorStore.js";
import { Document } from "@langchain/core/documents";
export const maxDuration = 300;
export const runtime = "nodejs";



export async function textIndexing(text, sourceId) {
  // 1️⃣ Create a document from raw text
  const docs = [
    new Document({
      pageContent: text,
      metadata: {},
    }),
  ];

  // 2️⃣ Split into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitDocuments(docs);

  const enrichedChunks = chunks.map((doc) => ({
    ...doc,
    metadata: {
      ...doc.metadata,
      source: "text",
      sourceId,
    },
  }));

  // 4️⃣ Store in vector DB
  await storeDocuments(enrichedChunks);

  return {
    sourceId,
  };
}
