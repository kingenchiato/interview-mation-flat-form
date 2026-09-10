import type { ApplicationStatus, JobStatus } from "./types";

export function formatYen(amount: number) {
  return new Intl.NumberFormat("ja-JP").format(amount);
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function daysLeft(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export const jobStatusLabel: Record<JobStatus, string> = {
  draft: "下書き",
  pending_review: "審査中",
  published: "掲載中",
  closed: "募集終了",
  rejected: "非承認",
};

export const applicationStatusLabel: Record<ApplicationStatus, string> = {
  applied: "応募受付",
  screening: "選定中",
  selected: "選考通過",
  scheduling: "日程調整中",
  confirmed: "日程確定",
  completed: "実施完了",
  rejected: "見送り",
  cancelled: "キャンセル",
};

export const applicationStatusTone: Record<ApplicationStatus, string> = {
  applied: "tone-info",
  screening: "tone-info",
  selected: "tone-success",
  scheduling: "tone-warn",
  confirmed: "tone-success",
  completed: "tone-muted",
  rejected: "tone-danger",
  cancelled: "tone-muted",
};

export const jobStatusTone: Record<JobStatus, string> = {
  draft: "tone-muted",
  pending_review: "tone-warn",
  published: "tone-success",
  closed: "tone-muted",
  rejected: "tone-danger",
};
