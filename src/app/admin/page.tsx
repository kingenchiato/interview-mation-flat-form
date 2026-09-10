"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  applicationStatusLabel,
  formatDateTime,
  jobStatusLabel,
  jobStatusTone,
} from "@/lib/format";
import { useAppStore } from "@/lib/store";

export default function AdminPage() {
  const router = useRouter();
  const { user, users, jobs, applications, ready, updateJobStatus, resetDemo } = useAppStore();

  useEffect(() => {
    if (!ready) return;
    if (!user || user.role !== "admin") router.replace("/login");
  }, [ready, user, router]);

  const pendingJobs = useMemo(
    () => jobs.filter((j) => j.status === "pending_review"),
    [jobs],
  );

  if (!user || user.role !== "admin") {
    return <div className="shell py-10 text-[var(--ink-soft)]">読み込み中...</div>;
  }

  return (
    <div className="shell py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="section-title !mb-0">
          <h2>運営管理画面</h2>
          <p>企業・ユーザー・掲載案件・応募状況を横断管理する基本管理機能です。</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={resetDemo}>
          デモデータ初期化
        </button>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-4">
        <div className="surface p-4">
          <div className="text-xs font-bold text-[var(--ink-faint)]">ユーザー</div>
          <div className="display text-3xl font-extrabold">
            {users.filter((u) => u.role === "user").length}
          </div>
        </div>
        <div className="surface p-4">
          <div className="text-xs font-bold text-[var(--ink-faint)]">企業</div>
          <div className="display text-3xl font-extrabold">
            {users.filter((u) => u.role === "company").length}
          </div>
        </div>
        <div className="surface p-4">
          <div className="text-xs font-bold text-[var(--ink-faint)]">案件</div>
          <div className="display text-3xl font-extrabold">{jobs.length}</div>
        </div>
        <div className="surface p-4">
          <div className="text-xs font-bold text-[var(--ink-faint)]">応募</div>
          <div className="display text-3xl font-extrabold">{applications.length}</div>
        </div>
      </div>

      <section className="surface mb-5 p-5">
        <h3 className="display mb-3 text-xl font-extrabold">掲載審査キュー</h3>
        <div className="grid gap-3">
          {pendingJobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-white/70 p-4"
            >
              <div>
                <div className="font-extrabold">{job.title}</div>
                <div className="text-sm text-[var(--ink-soft)]">
                  {job.companyName} / 作成 {formatDateTime(job.createdAt)}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-primary !min-h-9 !text-sm"
                  onClick={() => updateJobStatus(job.id, "published")}
                >
                  承認して掲載
                </button>
                <button
                  type="button"
                  className="btn btn-danger !min-h-9 !text-sm"
                  onClick={() => updateJobStatus(job.id, "rejected")}
                >
                  非承認
                </button>
              </div>
            </div>
          ))}
          {pendingJobs.length === 0 && (
            <p className="text-sm text-[var(--ink-soft)]">審査待ちの案件はありません。</p>
          )}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="surface p-5">
          <h3 className="display mb-3 text-xl font-extrabold">アカウント一覧</h3>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>名前</th>
                  <th>ロール</th>
                  <th>メール</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="font-semibold">
                      {u.name}
                      {u.companyName ? `（${u.companyName}）` : ""}
                    </td>
                    <td>{u.role}</td>
                    <td className="text-sm">{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="surface p-5">
          <h3 className="display mb-3 text-xl font-extrabold">案件・応募サマリー</h3>
          <div className="mb-4 table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>案件</th>
                  <th>状態</th>
                  <th>応募</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id}>
                    <td className="font-semibold">{j.title}</td>
                    <td>
                      <span className={`badge ${jobStatusTone[j.status]}`}>
                        {jobStatusLabel[j.status]}
                      </span>
                    </td>
                    <td>{j.applicantCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-xl bg-[rgba(11,107,99,0.05)] p-3 text-sm text-[var(--ink-soft)]">
            最新応募ステータス例：
            <ul className="mt-2 space-y-1">
              {applications.slice(0, 5).map((a) => (
                <li key={a.id}>
                  {a.userName} — {applicationStatusLabel[a.status]}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
