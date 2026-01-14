import "dotenv/config";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { storeDocuments } from "@/rag/vectorStore.js";
export const maxDuration = 300;
export const runtime = "nodejs";

export async function indexPDF(filePath, sourceId) {
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitDocuments(docs);

  const enrichedChunks = chunks.map((doc) => {
    const page =
      doc.metadata?.page ??
      doc.metadata?.loc?.pageNumber ??
      null;
      


    return {
      pageContent: doc.pageContent,
      metadata: {
        sourceId,
        source: "pdf",
        page,
      },
    };
  });


  await storeDocuments(enrichedChunks);
}
