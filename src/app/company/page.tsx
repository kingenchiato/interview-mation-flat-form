"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import {
  applicationStatusLabel,
  formatYen,
  jobStatusLabel,
  jobStatusTone,
} from "@/lib/format";
import { useAppStore } from "@/lib/store";

export default function CompanyDashboard() {
  const router = useRouter();
  const { user, jobs, applications, ready } = useAppStore();

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/login");
    else if (user.role !== "company") router.replace("/login");
  }, [ready, user, router]);

  const myJobs = useMemo(
    () => jobs.filter((j) => j.companyId === user?.id),
    [jobs, user?.id],
  );

  const myApps = useMemo(() => {
    const ids = new Set(myJobs.map((j) => j.id));
    return applications.filter((a) => ids.has(a.jobId));
  }, [applications, myJobs]);

  if (!user || user.role !== "company") {
    return <div className="shell py-10 text-[var(--ink-soft)]">読み込み中...</div>;
  }

  return (
    <div className="shell py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="section-title !mb-0">
          <h2>企業管理画面</h2>
          <p>{user.companyName} — 案件掲載から応募者管理・日程調整まで。</p>
        </div>
        <Link href="/company/jobs/new" className="btn btn-primary">
          <Plus size={16} /> 新規案件を作成
        </Link>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="surface p-4">
          <div className="text-xs font-bold text-[var(--ink-faint)]">掲載案件</div>
          <div className="display text-3xl font-extrabold">{myJobs.length}</div>
        </div>
        <div className="surface p-4">
          <div className="text-xs font-bold text-[var(--ink-faint)]">総応募数</div>
          <div className="display text-3xl font-extrabold">{myApps.length}</div>
        </div>
        <div className="surface p-4">
          <div className="text-xs font-bold text-[var(--ink-faint)]">選考待ち</div>
          <div className="display text-3xl font-extrabold">
            {myApps.filter((a) => a.status === "applied" || a.status === "screening").length}
          </div>
        </div>
      </div>

      <section className="surface mb-5 p-5">
        <h3 className="display mb-3 text-xl font-extrabold">自社案件</h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>タイトル</th>
                <th>謝礼</th>
                <th>応募</th>
                <th>ステータス</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myJobs.map((job) => (
                <tr key={job.id}>
                  <td className="font-semibold">{job.title}</td>
                  <td>¥{formatYen(job.reward)}</td>
                  <td>{job.applicantCount}</td>
                  <td>
                    <span className={`badge ${jobStatusTone[job.status]}`}>
                      {jobStatusLabel[job.status]}
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/company/jobs/manage?id=${job.id}`}
                      className="text-sm font-bold text-[var(--brand-deep)] underline"
                    >
                      管理
                    </Link>
                  </td>
                </tr>
              ))}
              {myJobs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-[var(--ink-soft)]">
                    まだ案件がありません。新規作成から始めましょう。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="surface p-5">
        <h3 className="display mb-3 text-xl font-extrabold">直近の応募</h3>
        <div className="grid gap-3">
          {myApps.slice(0, 6).map((app) => {
            const job = myJobs.find((j) => j.id === app.jobId);
            return (
              <div
                key={app.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3"
              >
                <div>
                  <div className="font-bold">{app.userName}</div>
                  <div className="text-sm text-[var(--ink-soft)]">{job?.title}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge tone-info">{applicationStatusLabel[app.status]}</span>
                  <Link
                    href={`/company/jobs/manage?id=${app.jobId}`}
                    className="text-sm font-bold text-[var(--brand-deep)]"
                  >
                    確認
                  </Link>
                </div>
              </div>
            );
          })}
          {myApps.length === 0 && (
            <p className="text-sm text-[var(--ink-soft)]">応募はまだありません。</p>
          )}
        </div>
      </section>
    </div>
  );
}
