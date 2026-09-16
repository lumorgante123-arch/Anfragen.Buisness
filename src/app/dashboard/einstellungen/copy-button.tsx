"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard-API evtl. nicht verfügbar – kein Fehler nötig.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
    >
      {copied ? "Kopiert!" : "Kopieren"}
    </button>
  );
}
