"use client";

import { useState } from "react";

/** 누르면 글자를 클립보드에 복사하는 태그 모양 버튼 */
export default function CopyChip({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button type="button" className="copy-chip" onClick={copy} aria-label={`${text} 복사`}>
      <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
        <rect x="5" y="5" width="9" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 3.5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {copied ? "복사했어요" : text}
    </button>
  );
}
