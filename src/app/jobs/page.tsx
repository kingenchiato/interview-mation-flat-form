"use client";

import { useMemo, useState } from "react";
import { JobCard } from "@/components/JobCard";
import { useAppStore } from "@/lib/store";

export default function JobsPage() {
  const { jobs } = useAppStore();
  const [q, setQ] = useState("");
  const [onlyOnline, setOnlyOnline] = useState(false);

  const filtered = useMemo(() => {
    return jobs
      .filter((j) => j.status === "published")
      .filter((j) => !onlyOnline || j.method === "online")
      .filter((j) => {
        if (!q.trim()) return true;
        const hay = `${j.title} ${j.description} ${j.conditions.join(" ")}`.toLowerCase();
        return hay.includes(q.trim().toLowerCase());
      });
  }, [jobs, onlyOnline, q]);

  return (
    <div className="shell py-8">
      <div className="section-title">
        <h2>インタビュー案件一覧</h2>
        <p>謝礼・所要時間・事前設問数が一目でわかる、国内リサーチサービスに近い一覧UIです。</p>
      </div>

      <div className="surface mb-5 grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-end">
        <div className="field">
          <label htmlFor="q">キーワード検索</label>
          <input
            id="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="例：人事 / 家事 / 在宅"
          />
        </div>
        <label className="mb-1 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-soft)]">
          <input
            type="checkbox"
            checked={onlyOnline}
            onChange={(e) => setOnlyOnline(e.target.checked)}
          />
          オンラインのみ
        </label>
      </div>

      <div className="mb-3 text-sm text-[var(--ink-faint)]">{filtered.length}件の案件</div>
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="surface p-8 text-center text-[var(--ink-soft)]">
          条件に一致する案件がありません。
        </div>
      )}
    </div>
  );
}
