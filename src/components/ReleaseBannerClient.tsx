"use client";
import React, { useEffect, useState } from "react";

export default function ReleaseBannerClient() {
  const [v, setV] = useState<string | null>(null);
  useEffect(() => {
    try {
      const id = (globalThis as any)?.__NEXT_DATA__?.buildId ?? Date.now();
      fetch(`/version.json?v=${id}`, { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => setV(j?.version ?? null))
        .catch(() => setV(null));
    } catch {
      setV(null);
    }
  }, []);
  if (!v) return null;
  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white">
      Текущая версия: {v}
    </div>
  );
}

