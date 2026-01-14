"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef } from "react";



export default function ChatPanel({ sourceId, status }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);


  async function sendMessage() {
    if (!input.trim()) return;

    setMessages((m) => [...m, { role: "user", text: input }]);
      setLoading(true);

    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: input, sourceId })
    });

    const data = await res.json();

setMessages((m) => [
  ...m,
  {
    role: "assistant",
    text: data.answer,     // ✅ STRING ONLY
    sources: data.sources  // optional
  }
]);

  setLoading(false);

  }

  const bottomRef = useRef(null);

useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);


  return (
    <main className="flex-1 flex flex-col bg-zinc-950">

  {/* Messages */}
  <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

    {messages.length === 0 && status !== "ready" && (
      <div className="text-zinc-500 text-sm mt-20 text-center">
        Upload a document or website to begin
      </div>
    )}

    {messages.map((m, i) => (
      <div
        key={i}
        className={`max-w-3xl ${
          m.role === "user" ? "ml-auto" : ""
        }`}
      >
        <div
          className={`rounded-xl px-5 py-4 text-sm leading-relaxed border backdrop-blur
            ${
              m.role === "user"
                ? "bg-indigo-600/10 text-indigo-300 border-indigo-500/30"
                : "bg-zinc-900/60 text-zinc-200 border-zinc-800 shadow-[0_0_0_1px_rgba(249,115,22,0.04)]"
            }
          `}
        >
          {m.role === "assistant" ? (
            <>
          <div className="prose prose-invert prose-sm max-w-none">
  <ReactMarkdown>
    {typeof m.text === "string" ? m.text : ""}
  </ReactMarkdown>
</div>


              {m.sources?.length > 0 && (
                <div className="mt-3 text-xs text-orange-400/70 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400/60"></span>

                  {m.sources[0].source === "pdf" && m.sources[0].page !== null && (
                    <>PDF · Page {m.sources[0].page}</>
                  )}

                  {m.sources[0].source === "website" && m.sources[0].url && (
                    <>
                      Website ·{" "}
                      <a
                        href={m.sources[0].url}
                        target="_blank"
                        className="underline hover:text-orange-400 transition"
                      >
                        Open
                      </a>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            m.text
          )}
        </div>
      </div>
    ))}

    {loading && (
  <div className="max-w-3xl">
    <div className="rounded-xl px-5 py-4 text-sm border backdrop-blur
      bg-zinc-900/60 text-zinc-200 border-zinc-800 shadow-[0_0_0_1px_rgba(249,115,22,0.04)]">
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  </div>
)}


        <div ref={bottomRef} />

  </div>


  {/* Input Bar */}
  <div className="border-t border-zinc-800 bg-zinc-950 px-6 py-4">
    <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus-within:border-orange-400/40 transition">

      <input
        type="text"
        placeholder={
          status === "ready"
            ? "Ask something about your data…"
            : "Index a document first"
        }
        disabled={status !== "ready"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none disabled:opacity-50"
      />

      <button
        onClick={sendMessage}
        disabled={status !== "ready"}
        className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-40"
      >
        {/* Send{loading && (
  <div className="max-w-xs rounded-2xl bg-gray-100 px-4 py-2">
    <div className="flex items-center gap-1">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
    </div>
  </div>
)} */}

      </button>
    </div>
  </div>
</main>



//     <main className="flex-1 flex flex-col p-6">
//       <div className="flex-2 overflow-y-auto space-y-4">
//         {messages.length === 0 && status !== "ready" && (
//           <div className="text-zinc-500 text-sm">
//             Upload a PDF or website to begin.
//           </div>
//         )}

//   {messages.map((m, i) => (
//   <div
//     key={i}
//     className={`max-w-2xl px-4 py-3 rounded-lg text-sm ${
//       m.role === "user"
//         ? "ml-auto bg-indigo-600 text-white"
//         : "bg-zinc-900 text-zinc-200 border border-zinc-800"
//     }`}
//   >
//     {m.role === "assistant" ? (
//       <>
//         <ReactMarkdown>
//           {typeof m.text === "string" ? m.text : ""}
//         </ReactMarkdown>

//       {m.sources?.length > 0 && (
//   <div className="text-xs text-zinc-500 mt-2">
//     {m.sources[0].source === "pdf" && m.sources[0].page !== null && (
//       <>Source: PDF · Page {m.sources[0].page}</>
//     )}

//   {m.sources[0].source === "website" && m.sources[0].url && (
//   <>Source: <a href={m.sources[0].url} target="_blank" className="underline">
//     Website
//   </a></>
// )}

//   </div>
// )}

//       </>
//     ) : (
//       m.text
//     )}
//   </div>
// ))}


//       </div>

//       <div className="mt-4 flex gap-2">
//         <input
//           type="text"
//           placeholder={
//             status === "ready"
//               ? "Ask a question from the data..."
//               : "Index a document first"
//           }
//           disabled={status !== "ready"}
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           className="flex-1 bg-zinc-900 border border-zinc-700 rounded-md px-4 py-3 disabled:opacity-50"
//         />
//         <button
//           onClick={sendMessage}
//           disabled={status !== "ready"}
//           className="bg-indigo-600 px-5 rounded-md disabled:opacity-50"
//         >
//           Send
//         </button>
//       </div>
//     </main>
  );
}
