"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MonitorPlay,
  Users,
  Video,
} from "lucide-react";
import {
  applicationStatusLabel,
  daysLeft,
  formatDate,
  formatYen,
  jobStatusLabel,
  jobStatusTone,
} from "@/lib/format";
import { useAppStore } from "@/lib/store";

const slotOptions = [
  "2026-09-15T19:00:00+09:00",
  "2026-09-16T12:00:00+09:00",
  "2026-09-16T20:00:00+09:00",
  "2026-09-17T15:00:00+09:00",
  "2026-09-18T10:00:00+09:00",
];

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { jobs, applications, user, applyToJob } = useAppStore();
  const job = jobs.find((j) => j.id === params.id);

  const existing = useMemo(
    () => applications.find((a) => a.jobId === params.id && a.userId === user?.id),
    [applications, params.id, user?.id],
  );

  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [slots, setSlots] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"detail" | "form" | "done">("detail");

  if (!job) {
    return (
      <div className="shell py-12">
        <div className="surface p-8 text-center">
          <p className="mb-4">案件が見つかりませんでした。</p>
          <Link href="/jobs" className="btn btn-ghost">
            一覧へ戻る
          </Link>
        </div>
      </div>
    );
  }

  function toggleMulti(qid: string, option: string) {
    setAnswers((prev) => {
      const cur = Array.isArray(prev[qid]) ? [...(prev[qid] as string[])] : [];
      const next = cur.includes(option) ? cur.filter((x) => x !== option) : [...cur, option];
      return { ...prev, [qid]: next };
    });
  }

  function toggleSlot(slot: string) {
    setSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : prev.length >= 3 ? prev : [...prev, slot],
    );
  }

  function submitApply(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    for (const q of job!.screeningQuestions) {
      if (!q.required) continue;
      const val = answers[q.id];
      if (!val || (Array.isArray(val) && val.length === 0) || val === "") {
        setMessage("必須の事前設問に回答してください");
        return;
      }
    }
    if (slots.length === 0) {
      setMessage("希望日程を1つ以上選択してください");
      return;
    }
    const res = applyToJob(job!.id, answers, slots);
    if (!res.ok) {
      setMessage(res.message || "応募に失敗しました");
      return;
    }
    setStep("done");
    setMessage("");
  }

  return (
    <div className="shell py-8">
      <Link href="/jobs" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand-deep)]">
        <ArrowLeft size={16} /> 案件一覧へ
      </Link>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="surface p-6 md:p-8">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className={`badge ${jobStatusTone[job.status]}`}>{jobStatusLabel[job.status]}</span>
            <span className="badge tone-brand">{job.method === "online" ? "オンライン実施" : "対面実施"}</span>
            {job.recording && <span className="badge tone-muted">録画あり</span>}
          </div>
          <h1 className="display mb-3 text-[clamp(1.5rem,3vw,2.1rem)] font-extrabold leading-snug">
            {job.title}
          </h1>
          <p className="mb-5 whitespace-pre-wrap leading-relaxed text-[var(--ink-soft)]">
            {job.description}
          </p>

          <h2 className="mb-2 text-sm font-extrabold text-[var(--brand-deep)]">募集条件</h2>
          <ul className="mb-6 list-disc space-y-1 pl-5 text-[var(--ink-soft)]">
            {job.conditions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>

          <div className="meta-row">
            <span className="inline-flex items-center gap-1">
              <Clock3 size={14} /> 募集終了 {formatDate(job.deadline)}（あと{daysLeft(job.deadline)}日）
            </span>
            <span className="inline-flex items-center gap-1">
              <Users size={14} /> 募集 {job.recruitCount}名 / 応募 {job.applicantCount}名
            </span>
            <span className="inline-flex items-center gap-1">
              <Video size={14} /> {job.tool}
            </span>
            <span className="inline-flex items-center gap-1">
              <MonitorPlay size={14} /> 事前設問 {job.screeningQuestions.length}問
            </span>
          </div>
        </article>

        <aside className="surface h-fit p-6">
          <div className="reward mb-1 text-4xl">¥{formatYen(job.reward)}</div>
          <div className="mb-5 text-sm text-[var(--ink-faint)]">謝礼 / {job.durationMin}分</div>

          {existing ? (
            <div className="rounded-2xl bg-[var(--brand-soft)] p-4">
              <div className="mb-1 flex items-center gap-2 font-extrabold text-[var(--brand-deep)]">
                <CheckCircle2 size={18} /> 応募済み
              </div>
              <p className="text-sm text-[var(--ink-soft)]">
                現在のステータス：{applicationStatusLabel[existing.status]}
              </p>
              <Link href="/mypage" className="btn btn-ghost mt-4 w-full">
                マイページで確認
              </Link>
            </div>
          ) : step === "done" ? (
            <div className="rounded-2xl bg-[var(--brand-soft)] p-4">
              <div className="mb-1 font-extrabold text-[var(--brand-deep)]">応募が完了しました</div>
              <p className="text-sm text-[var(--ink-soft)]">
                企業の選定結果はマイページで確認できます。
              </p>
              <Link href="/mypage" className="btn btn-primary mt-4 w-full">
                マイページへ
              </Link>
            </div>
          ) : step === "detail" ? (
            <div className="grid gap-3">
              {!user && (
                <p className="text-sm text-[var(--ink-soft)]">
                  応募にはユーザーログインが必要です。
                </p>
              )}
              {user && user.role !== "user" && (
                <p className="text-sm text-[var(--danger)]">
                  応募はユーザーロールでログインしてください。
                </p>
              )}
              <button
                type="button"
                className="btn btn-accent w-full"
                disabled={!!user && user.role !== "user"}
                onClick={() => {
                  if (!user) router.push("/login");
                  else setStep("form");
                }}
              >
                この案件に応募する
              </button>
            </div>
          ) : (
            <form className="grid gap-4" onSubmit={submitApply}>
              <h3 className="font-extrabold">事前アンケート</h3>
              {job.screeningQuestions.map((q) => (
                <div key={q.id} className="field">
                  <label>
                    {q.label}
                    {q.required && <span className="text-[var(--danger)]"> *</span>}
                  </label>
                  {q.type === "text" && (
                    <textarea
                      rows={3}
                      value={(answers[q.id] as string) || ""}
                      onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                    />
                  )}
                  {q.type === "single" && (
                    <div className="grid gap-2">
                      {q.options?.map((opt) => (
                        <label key={opt} className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name={q.id}
                            checked={answers[q.id] === opt}
                            onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}
                  {q.type === "multi" && (
                    <div className="grid gap-2">
                      {q.options?.map((opt) => (
                        <label key={opt} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={((answers[q.id] as string[]) || []).includes(opt)}
                            onChange={() => toggleMulti(q.id, opt)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="field">
                <label>希望日程（最大3つ）</label>
                <div className="grid gap-2">
                  {slotOptions.map((slot) => (
                    <label key={slot} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={slots.includes(slot)}
                        onChange={() => toggleSlot(slot)}
                      />
                      {new Date(slot).toLocaleString("ja-JP", {
                        month: "short",
                        day: "numeric",
                        weekday: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </label>
                  ))}
                </div>
              </div>

              {message && <p className="text-sm font-semibold text-[var(--danger)]">{message}</p>}
              <div className="flex gap-2">
                <button type="button" className="btn btn-ghost flex-1" onClick={() => setStep("detail")}>
                  戻る
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  応募を送信
                </button>
              </div>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}
