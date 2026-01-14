"use client";

import { useState } from "react";
import { FileText, Globe, Type, Github, Upload, CheckCircle, Loader2 } from "lucide-react";

export default function Sidebar({
  activeSources,
  setActiveSources,
  status,
  setStatus,
}) {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  async function uploadDocument() {
    if (!file) return;

    setStatus("indexing");

    const ext = file.name.split(".").pop().toLowerCase();

    const endpoint =
      ext === "pdf"
        ? "/api/index/pdf"
        : ext === "pptx"
        ? "/api/index/pptx"
        : null;

    if (!endpoint) {
      alert("Unsupported file type");
      setStatus("idle");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setActiveSources((prev) => [
      ...prev,
      {
        sourceId: data.sourceId,
        name: file.name,
      },
    ]);

    setStatus("ready");
  }

  async function indexWebsite() {
    if (!url) return;

    setStatus("indexing");

    const res = await fetch("/api/index/website", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    setActiveSources((prev) => [
      ...prev,
      {
        sourceId: data.sourceId,
        name: new URL(url).hostname,
      },
    ]);
    setStatus("ready");
  }

  async function indexText() {
    if (!text.trim()) return;

    setStatus("indexing");

    const res = await fetch("/api/index/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    setActiveSources((prev) => [
      ...prev,
      {
        sourceId: data.sourceId,
        name: "Text input",
      },
    ]);

    setText("");
    setStatus("ready");
  }

  async function indexGithub() {
    if (!githubUrl) return;

    if (!githubUrl.startsWith("https://github.com/")) {
      alert("Please enter a valid GitHub repository URL");
      return;
    }

    setStatus("indexing");

    const res = await fetch("/api/index/github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: githubUrl }),
    });

    const data = await res.json();

    setActiveSources((prev) => [
      ...prev,
      {
        sourceId: data.sourceId,
        name: new URL(githubUrl).pathname.replace("/", ""),
      },
    ]);

    setGithubUrl("");
    setStatus("ready");
  }

  return (
    <aside className="w-[40vh] bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col gap-6 ">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-xl font-medium text-zinc-100">MYLM</h1>

        {/* Status */}
        <div className="text-sm">
          {status === "idle" && (
            <div className="flex items-center gap-2 text-zinc-500">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-600"></div>
              No document indexed
            </div>
          )}
          {status === "indexing" && (
            <div className="flex items-center gap-2 text-amber-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Indexing...
            </div>
          )}
          {status === "ready" && (
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" />
              Ready
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
        {/* Upload Files */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wide">
            <FileText className="w-3.5 h-3.5" />
            Document
          </label>
          <input
            type="file"
            accept=".pdf,.pptx"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={status === "indexing"}
            className="w-full text-sm text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border file:border-zinc-700 file:text-xs file:bg-zinc-900 file:text-zinc-300 hover:file:bg-zinc-800 file:cursor-pointer cursor-pointer disabled:opacity-50"
          />
          <button
            onClick={uploadDocument}
            disabled={status === "indexing"}
            className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded px-3 py-2 text-sm font-medium text-zinc-200 transition-colors"
          >
            Index
          </button>
        </div>

        <div className="border-t border-zinc-800"></div>

        {/* Website URL */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wide">
            <Globe className="w-3.5 h-3.5" />
            Website
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={status === "indexing"}
            placeholder="https://example.com"
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors disabled:opacity-50"
          />
          <button
            onClick={indexWebsite}
            disabled={status === "indexing"}
            className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded px-3 py-2 text-sm font-medium text-zinc-200 transition-colors"
          >
            Index
          </button>
        </div>

        <div className="border-t border-zinc-800"></div>

        {/* Paste Text */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wide">
            <Type className="w-3.5 h-3.5" />
            Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={status === "indexing"}
            placeholder="Paste text here..."
            rows={4}
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors resize-none disabled:opacity-50"
          />
          <button
            onClick={indexText}
            disabled={status === "indexing"}
            className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded px-3 py-2 text-sm font-medium text-zinc-200 transition-colors"
          >
            Index
          </button>
        </div>

        <div className="border-t border-zinc-800"></div>

        {/* GitHub Repository */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wide">
            <Github className="w-3.5 h-3.5" />
            GitHub
          </label>
          <input
            type="text"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            disabled={status === "indexing"}
            placeholder="https://github.com/user/repo"
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors disabled:opacity-50"
          />
          <button
            onClick={indexGithub}
            disabled={status === "indexing"}
            className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded px-3 py-2 text-sm font-medium text-zinc-200 transition-colors"
          >
            Index
          </button>
        </div>

        {/* Active Context */}
        {activeSources.length > 0 && (
          <>
            <div className="border-t border-zinc-800"></div>
            <div className="space-y-2">
              <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                Active Context
              </div>
              <div className="space-y-1.5">
                {activeSources.map((s) => (
                  <div
                    key={s.sourceId}
                    className="flex items-center gap-2 text-sm text-zinc-400 px-2 py-1.5"
                  >
                    <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
                    <span className="truncate">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}