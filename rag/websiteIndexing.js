import "dotenv/config";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { storeDocuments } from "@/rag/vectorStore.js";
import { PlaywrightWebBaseLoader } from "@langchain/community/document_loaders/web/playwright";
export const maxDuration = 300;
export const runtime = "nodejs";



export async function indexWebsite(url, sourceId) {
  //Scrape website
  const loader = new PlaywrightWebBaseLoader(url, {
    launchOptions: { headless: true },
    gotoOptions: { waitUntil: "networkidle" },
  });

  const docs = await loader.load();

  // Chunking
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 150,
  });

  const chunks = await splitter.splitDocuments(docs);

  // 3. Add metadata
  const enrichedChunks = chunks.map((doc) => ({
    ...doc,
    metadata: {
      ...doc.metadata,
      source: "website",
      sourceId,
      url,
    },
  }));

    await storeDocuments(enrichedChunks);

}
