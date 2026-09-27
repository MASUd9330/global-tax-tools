"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const onClick = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(value).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        // Fallback: select + copy via execCommand (older browsers)
        const ta = document.createElement("textarea");
        ta.value = value;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch {}
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-500 hover:bg-slate-50"
      title="Copy"
    >
      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}