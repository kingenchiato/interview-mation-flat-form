"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import type { ScreeningQuestion } from "@/lib/types";

export default function NewJobPage() {
  const router = useRouter();
  const { user, createJob, ready } = useAppStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [conditionsText, setConditionsText] = useState("");
  const [reward, setReward] = useState(6000);
  const [durationMin, setDurationMin] = useState(60);
  const [recruitCount, setRecruitCount] = useState(5);
  const [tool, setTool] = useState<"Zoom" | "Google Meet" | "Microsoft Teams">("Google Meet");
  const [recording, setRecording] = useState(true);
  const [deadline, setDeadline] = useState("2026-09-30");
  const [qLabel, setQLabel] = useState("対象条件に当てはまりますか？");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;
    if (!user || user.role !== "company") router.replace("/login");
  }, [ready, user, router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("タイトルと概要は必須です");
      return;
    }
    const conditions = conditionsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const screeningQuestions: ScreeningQuestion[] = [
      {
        id: "q1",
        type: "single",
        label: qLabel || "対象条件に当てはまりますか？",
        required: true,
        options: ["はい", "いいえ"],
      },
    ];

    const job = createJob({
      title: title.trim(),
      description: description.trim(),
      conditions: conditions.length ? conditions : ["条件は個別に確認します"],
      reward,
      durationMin,
      recruitCount,
      method: "online",
      tool,
      recording,
      deadline: `${deadline}T23:59:00+09:00`,
      screeningQuestions,
      status: "pending_review",
    });
    router.push(`/company/jobs/manage?id=${job.id}`);
  }

  if (!user || user.role !== "company") {
    return <div className="shell py-10 text-[var(--ink-soft)]">読み込み中...</div>;
  }

  return (
    <div className="shell py-8">
      <div className="section-title">
        <h2>インタビュー案件の作成</h2>
        <p>作成後は運営審査（pending）を経て掲載されます。デモでは運営画面から承認できます。</p>
      </div>

      <form className="surface mx-auto grid max-w-3xl gap-4 p-6 md:p-8" onSubmit={onSubmit}>
        <div className="field">
          <label>案件タイトル</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：○○サービスの利用経験がある方へ"
            required
          />
        </div>
        <div className="field">
          <label>案件概要</label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="調査目的、当日の流れ、注意事項など"
            required
          />
        </div>
        <div className="field">
          <label>募集条件（1行に1つ）</label>
          <textarea
            rows={4}
            value={conditionsText}
            onChange={(e) => setConditionsText(e.target.value)}
            placeholder={"20〜40代の方\n週3日以上在宅勤務している方"}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="field">
            <label>謝礼（円）</label>
            <input
              type="number"
              min={1000}
              step={500}
              value={reward}
              onChange={(e) => setReward(Number(e.target.value))}
            />
          </div>
          <div className="field">
            <label>所要時間（分）</label>
            <input
              type="number"
              min={15}
              step={15}
              value={durationMin}
              onChange={(e) => setDurationMin(Number(e.target.value))}
            />
          </div>
          <div className="field">
            <label>募集人数</label>
            <input
              type="number"
              min={1}
              value={recruitCount}
              onChange={(e) => setRecruitCount(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="field">
            <label>実施ツール</label>
            <select value={tool} onChange={(e) => setTool(e.target.value as typeof tool)}>
              <option value="Google Meet">Google Meet</option>
              <option value="Zoom">Zoom</option>
              <option value="Microsoft Teams">Microsoft Teams</option>
            </select>
          </div>
          <div className="field">
            <label>募集締切</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
        </div>
        <label className="inline-flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={recording} onChange={(e) => setRecording(e.target.checked)} />
          録画あり
        </label>
        <div className="field">
          <label>事前設問（1問・デモ簡易版）</label>
          <input value={qLabel} onChange={(e) => setQLabel(e.target.value)} />
        </div>
        {error && <p className="text-sm font-semibold text-[var(--danger)]">{error}</p>}
        <div className="flex gap-2">
          <button type="button" className="btn btn-ghost" onClick={() => router.push("/company")}>
            キャンセル
          </button>
          <button type="submit" className="btn btn-primary">
            審査に提出する
          </button>
        </div>
      </form>
    </div>
  );
}
