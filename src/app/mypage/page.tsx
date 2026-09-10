"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  applicationStatusLabel,
  applicationStatusTone,
  formatDateTime,
} from "@/lib/format";
import { useAppStore } from "@/lib/store";

export default function MyPage() {
  const router = useRouter();
  const { user, applications, jobs, updateProfile, ready } = useAppStore();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    gender: "",
    age: "",
    prefecture: "",
    occupation: "",
    bio: "",
  });

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/login");
    else if (user.role !== "user") router.replace("/login");
  }, [ready, user, router]);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      gender: user.gender || "",
      age: user.age ? String(user.age) : "",
      prefecture: user.prefecture || "",
      occupation: user.occupation || "",
      bio: user.bio || "",
    });
  }, [user]);

  const mine = useMemo(
    () => applications.filter((a) => a.userId === user?.id),
    [applications, user?.id],
  );

  if (!user || user.role !== "user") {
    return <div className="shell py-10 text-[var(--ink-soft)]">読み込み中...</div>;
  }

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    updateProfile({
      name: form.name,
      gender: form.gender,
      age: form.age ? Number(form.age) : undefined,
      prefecture: form.prefecture,
      occupation: form.occupation,
      bio: form.bio,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="shell py-8">
      <div className="section-title">
        <h2>マイページ</h2>
        <p>プロフィールと応募・実施状況を確認できます。</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="surface grid gap-3 p-6" onSubmit={saveProfile}>
          <h3 className="display text-xl font-extrabold">プロフィール</h3>
          <div className="field">
            <label>氏名</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="field">
              <label>性別</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="">未設定</option>
                <option value="女性">女性</option>
                <option value="男性">男性</option>
                <option value="その他">その他</option>
                <option value="回答しない">回答しない</option>
              </select>
            </div>
            <div className="field">
              <label>年齢</label>
              <input
                type="number"
                min={18}
                max={99}
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
            </div>
          </div>
          <div className="field">
            <label>居住地（都道府県）</label>
            <input
              value={form.prefecture}
              onChange={(e) => setForm({ ...form, prefecture: e.target.value })}
              placeholder="東京都"
            />
          </div>
          <div className="field">
            <label>職業</label>
            <input
              value={form.occupation}
              onChange={(e) => setForm({ ...form, occupation: e.target.value })}
            />
          </div>
          <div className="field">
            <label>自己紹介</label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            プロフィールを保存
          </button>
          {saved && <p className="text-sm font-semibold text-[var(--success)]">保存しました</p>}
        </form>

        <section className="surface p-6">
          <h3 className="display mb-4 text-xl font-extrabold">応募・実施状況</h3>
          <div className="grid gap-3">
            {mine.map((app) => {
              const job = jobs.find((j) => j.id === app.jobId);
              return (
                <div key={app.id} className="rounded-2xl border border-[var(--line)] bg-white/70 p-4">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <Link href={`/jobs/${app.jobId}`} className="font-extrabold hover:underline">
                      {job?.title || "案件"}
                    </Link>
                    <span className={`badge ${applicationStatusTone[app.status]}`}>
                      {applicationStatusLabel[app.status]}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--ink-soft)]">
                    応募日：{formatDateTime(app.createdAt)}
                  </div>
                  {app.confirmedSlot && (
                    <div className="mt-2 rounded-xl bg-[var(--brand-soft)] px-3 py-2 text-sm">
                      <div className="font-bold text-[var(--brand-deep)]">実施予定</div>
                      <div>{formatDateTime(app.confirmedSlot)}</div>
                      {app.meetingUrl && (
                        <a
                          href={app.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-[var(--brand-deep)] underline"
                        >
                          会議URLを開く
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {mine.length === 0 && (
              <p className="text-sm text-[var(--ink-soft)]">まだ応募がありません。</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
