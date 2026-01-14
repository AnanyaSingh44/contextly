import "dotenv/config";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { storeDocuments } from "@/rag/vectorStore.js";
import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";
export const maxDuration = 300;
export const runtime = "nodejs";


export async function indexPPTX(filePath,sourceId)
{
    const loader=new PPTXLoader(filePath);
    const docs=await loader.load();

      const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

   const chunks = await splitter.splitDocuments(docs);

  const enrichedChunks = chunks.map((doc) => {
    const slide=doc.metadata?.slideNumber??null;

      


    return {
      pageContent: doc.pageContent,
      metadata: {
        sourceId,
        source: "pptx",
        page:slide,
      },
    };
  });

    await storeDocuments(enrichedChunks);

}