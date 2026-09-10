"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  applicationStatusLabel,
  applicationStatusTone,
  formatDateTime,
  formatYen,
  jobStatusLabel,
  jobStatusTone,
} from "@/lib/format";
import { useAppStore } from "@/lib/store";
import type { ApplicationStatus } from "@/lib/types";

export default function CompanyJobManagePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    user,
    jobs,
    applications,
    ready,
    updateApplicationStatus,
    confirmSchedule,
  } = useAppStore();
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!ready) return;
    if (!user || user.role !== "company") router.replace("/login");
  }, [ready, user, router]);

  const job = jobs.find((j) => j.id === params.id);
  const apps = useMemo(
    () => applications.filter((a) => a.jobId === params.id),
    [applications, params.id],
  );

  if (!user || user.role !== "company") {
    return <div className="shell py-10 text-[var(--ink-soft)]">読み込み中...</div>;
  }

  if (!job || job.companyId !== user.id) {
    return (
      <div className="shell py-10">
        <div className="surface p-8 text-center">
          <p className="mb-4">案件が見つからないか、権限がありません。</p>
          <Link href="/company" className="btn btn-ghost">
            企業管理へ
          </Link>
        </div>
      </div>
    );
  }

  function setStatus(id: string, status: ApplicationStatus) {
    updateApplicationStatus(id, status);
    setNotice(`ステータスを「${applicationStatusLabel[status]}」に更新しました`);
  }

  function onConfirm(id: string, slot: string) {
    confirmSchedule(id, slot);
    setNotice("日程を確定し、会議URLを発行しました");
  }

  return (
    <div className="shell py-8">
      <Link href="/company" className="mb-4 inline-block text-sm font-bold text-[var(--brand-deep)]">
        ← 企業管理へ
      </Link>

      <div className="surface mb-5 p-6">
        <div className="mb-2 flex flex-wrap gap-2">
          <span className={`badge ${jobStatusTone[job.status]}`}>{jobStatusLabel[job.status]}</span>
          <span className="badge tone-muted">{job.tool}</span>
        </div>
        <h1 className="display mb-2 text-2xl font-extrabold md:text-3xl">{job.title}</h1>
        <p className="text-sm text-[var(--ink-soft)]">
          謝礼 ¥{formatYen(job.reward)} / {job.durationMin}分 / 応募 {apps.length}名
        </p>
        {notice && (
          <p className="mt-3 rounded-xl bg-[var(--brand-soft)] px-3 py-2 text-sm font-semibold text-[var(--brand-deep)]">
            {notice}
          </p>
        )}
      </div>

      <section className="surface p-5 md:p-6">
        <h2 className="display mb-4 text-xl font-extrabold">応募者の確認・選考・日程調整</h2>
        <div className="grid gap-4">
          {apps.map((app) => (
            <article key={app.id} className="rounded-2xl border border-[var(--line)] bg-white/75 p-4">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-lg font-extrabold">{app.userName}</div>
                  <div className="text-sm text-[var(--ink-soft)]">
                    {[app.userAge && `${app.userAge}歳`, app.userPrefecture, app.userOccupation]
                      .filter(Boolean)
                      .join(" / ")}
                  </div>
                </div>
                <span className={`badge ${applicationStatusTone[app.status]}`}>
                  {applicationStatusLabel[app.status]}
                </span>
              </div>

              <div className="mb-3 rounded-xl bg-[rgba(11,107,99,0.05)] p-3 text-sm">
                <div className="mb-1 font-bold text-[var(--brand-deep)]">事前設問の回答</div>
                <ul className="space-y-1 text-[var(--ink-soft)]">
                  {Object.entries(app.answers).map(([k, v]) => (
                    <li key={k}>
                      <span className="font-semibold text-[var(--ink)]">{k}: </span>
                      {Array.isArray(v) ? v.join("、") : v}
                    </li>
                  ))}
                </ul>
              </div>

              {app.proposedSlots.length > 0 && (
                <div className="mb-3">
                  <div className="mb-1 text-sm font-bold">希望日程</div>
                  <div className="flex flex-wrap gap-2">
                    {app.proposedSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className="btn btn-ghost !min-h-9 !px-3 !text-sm"
                        onClick={() => onConfirm(app.id, slot)}
                        disabled={app.status === "confirmed" || app.status === "completed"}
                      >
                        {formatDateTime(slot)} で確定
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {app.confirmedSlot && (
                <p className="mb-3 text-sm font-semibold text-[var(--success)]">
                  確定：{formatDateTime(app.confirmedSlot)}
                  {app.meetingUrl ? ` / ${app.meetingUrl}` : ""}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-primary !min-h-9 !text-sm"
                  onClick={() => setStatus(app.id, "selected")}
                >
                  選考通過
                </button>
                <button
                  type="button"
                  className="btn btn-ghost !min-h-9 !text-sm"
                  onClick={() => setStatus(app.id, "screening")}
                >
                  選定中にする
                </button>
                <button
                  type="button"
                  className="btn btn-danger !min-h-9 !text-sm"
                  onClick={() => setStatus(app.id, "rejected")}
                >
                  見送り
                </button>
                {app.status === "confirmed" && (
                  <button
                    type="button"
                    className="btn btn-accent !min-h-9 !text-sm"
                    onClick={() => setStatus(app.id, "completed")}
                  >
                    実施完了にする
                  </button>
                )}
              </div>
            </article>
          ))}
          {apps.length === 0 && (
            <p className="text-sm text-[var(--ink-soft)]">まだ応募者がいません。</p>
          )}
        </div>
      </section>
    </div>
  );
}
