import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import Groq from "groq-sdk";


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateHyde(userQuery) {
  const prompt = `
You are given access to a knowledge base that includes:
- GitHub repositories
- PDFs
- PPT slides
- Websites

Write a detailed factual answer to this question
as if you had access to all of that data.

Question:
${userQuery}

Write a single coherent explanation.
Do not say you are guessing.
`;

  const res = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  return res.choices[0].message.content || "";
}

export async function chatWithRAG({
  userQuery,
  sourceIds = [],
}) {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
   url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
      collectionName: "contextly",
    }
  );

  const retriever = vectorStore.asRetriever({
    k: 10,
    filter:
      sourceIds.length > 0
        ? {
            must: [
              {
                key: "sourceId",
                match: {
                  any: sourceIds,
                },
              },
            ],
          }
        : undefined,
  });

  // Use HyDE directly on user query
  const hyde = await generateHyde(userQuery);

  const docs = await retriever.invoke(hyde);

  if (!docs || docs.length === 0) {
    return {
      answer: "Not available in uploaded data",
      sources: [],
    };
  }

  const context = docs
    .map((doc, index) => {
      const meta = doc.metadata ?? {};

      let sourceInfo;
      if (meta.source === "pdf") {
        sourceInfo = `PDF Page ${meta.page ?? "N/A"}`;
      } else if (meta.source === "github") {
        sourceInfo = `GitHub: ${meta.path ?? meta.repoUrl}`;
      } else {
        sourceInfo = `Website: ${meta.url ?? "N/A"}`;
      }

      return `Source ${index + 1} (${sourceInfo}):\n${doc.pageContent}`;
    })
    .join("\n\n");

  const prompt = `
You are a strict RAG-based AI assistant.

RULES:
- Answer ONLY from the provided context
- If the answer is not present, reply exactly:
  "Not available in uploaded data"
- Do NOT use outside knowledge

CONTEXT:
${context}

QUESTION:
${userQuery}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  const answer =
    response.choices[0].message.content || "No answer generated.";

  return {
    answer,
    sources: docs.map((doc) => ({
      source: doc.metadata.source,
      page: doc.metadata.page ?? null,
      url: doc.metadata.url ?? null,
    })),
  };
}
