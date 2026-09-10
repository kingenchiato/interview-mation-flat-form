import Link from "next/link";
import {
  CalendarClock,
  Clock3,
  MapPin,
  MonitorPlay,
  Users,
  Video,
} from "lucide-react";
import type { InterviewJob } from "@/lib/types";
import { daysLeft, formatYen, jobStatusLabel, jobStatusTone } from "@/lib/format";

export function JobCard({ job }: { job: InterviewJob }) {
  const left = daysLeft(job.deadline);

  return (
    <Link href={`/jobs/${job.id}`} className="job-card surface block">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap gap-2">
            <span className={`badge ${jobStatusTone[job.status]}`}>
              {jobStatusLabel[job.status]}
            </span>
            <span className="badge tone-brand">
              {job.method === "online" ? "オンライン" : "対面"}
            </span>
            {job.recording && <span className="badge tone-muted">録画あり</span>}
          </div>
          <h3 className="display text-[1.05rem] font-extrabold leading-snug">{job.title}</h3>
        </div>
        <div className="text-right">
          <div className="reward text-[1.55rem]">¥{formatYen(job.reward)}</div>
          <div className="text-xs text-[var(--ink-faint)]">/ {job.durationMin}分</div>
        </div>
      </div>

      <div className="meta-row">
        <span className="inline-flex items-center gap-1">
          <Clock3 size={14} /> 募集終了まであと{left}日
        </span>
        <span className="inline-flex items-center gap-1">
          <Users size={14} /> 今 {job.applicantCount}人が応募中
        </span>
        <span className="inline-flex items-center gap-1">
          <Video size={14} /> {job.tool}
        </span>
        <span className="inline-flex items-center gap-1">
          <MonitorPlay size={14} /> 事前設問 {job.screeningQuestions.length}問
        </span>
        <span className="inline-flex items-center gap-1">
          <CalendarClock size={14} /> 募集 {job.recruitCount}名
        </span>
      </div>

      <div className="rounded-xl bg-[rgba(11,107,99,0.05)] px-3 py-2.5 text-sm text-[var(--ink-soft)]">
        <div className="mb-1 inline-flex items-center gap-1 font-bold text-[var(--brand-deep)]">
          <MapPin size={14} /> 募集条件
        </div>
        <ul className="list-disc space-y-0.5 pl-5">
          {job.conditions.slice(0, 2).map((c) => (
            <li key={c}>{c}</li>
          ))}
          {job.conditions.length > 2 && (
            <li className="list-none text-[var(--ink-faint)]">ほか {job.conditions.length - 2} 件</li>
          )}
        </ul>
      </div>
    </Link>
  );
}
