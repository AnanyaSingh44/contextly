import "dotenv/config";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { storeDocuments } from "@/rag/vectorStore.js";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
export const maxDuration = 300;
export const runtime = "nodejs";


export async function githubIndexing(url,sourceId)
{
    
      const loader = new GithubRepoLoader(
 url,
    {
      branch: "main",            // branch to load
      recursive: true,          // set true to fetch all subdirectories
      unknown: "warn",           // warn on unknown file types
      maxConcurrency: 2,         // concurrent fetches
      accessToken:process.env.GITHUB_ACCESS_TOKEN,
  ignorePaths: [
    "**/node_modules/**",
    "**/.git/**",
    "**/dist/**",
    "**/build/**",
    "**/.next/**",
    "**/*.lock",
    "**/*.png",
    "**/*.jpg",
    "**/*.jpeg",
    "**/*.svg",
    "**/*.ico",
    "**/*.wasm",
    "**/*.exe",
    "**/*.bin",
    "**/*.pdf",
  ],
    }
  );

    const docs = await loader.load();

      const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

    const chunks = await splitter.splitDocuments(docs);

  const enrichedChunks = chunks.map((doc) => ({
    ...doc,
    metadata: {
      ...doc.metadata,   
      source: "github",
      repoUrl: url,
      sourceId,
    },
  }));

  await storeDocuments(enrichedChunks);


}