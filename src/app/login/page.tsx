"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Shield, UserRound } from "lucide-react";
import { DEMO_PASSWORD } from "@/lib/seed";
import { useAppStore } from "@/lib/store";
import type { Role } from "@/lib/types";

const demos: { role: Role; title: string; email: string; desc: string; icon: typeof UserRound }[] = [
  {
    role: "user",
    title: "ユーザー",
    email: "user@demo.jp",
    desc: "案件閲覧・応募・マイページ確認",
    icon: UserRound,
  },
  {
    role: "company",
    title: "企業",
    email: "company@demo.jp",
    desc: "案件作成・応募者選定・日程調整",
    icon: Building2,
  },
  {
    role: "admin",
    title: "運営",
    email: "admin@demo.jp",
    desc: "掲載審査・ユーザー/企業管理",
    icon: Shield,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemo, resetDemo } = useAppStore();
  const [email, setEmail] = useState("user@demo.jp");
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState("");

  function redirectByRole(role: Role) {
    if (role === "company") router.push("/company");
    else if (role === "admin") router.push("/admin");
    else router.push("/jobs");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) {
      setError(res.message || "ログインに失敗しました");
      return;
    }
    const role = demos.find((d) => d.email === email)?.role || "user";
    redirectByRole(role);
  }

  function onDemo(role: Role) {
    loginAsDemo(role);
    redirectByRole(role);
  }

  return (
    <div className="shell py-10">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="surface p-6 md:p-8">
          <h1 className="display mb-2 text-3xl font-extrabold">ログイン</h1>
          <p className="mb-6 text-sm text-[var(--ink-soft)]">
            デモ用パスワードはすべて <strong>{DEMO_PASSWORD}</strong> です。
          </p>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="email">メールアドレス</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">パスワード</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {error && <p className="text-sm font-semibold text-[var(--danger)]">{error}</p>}
            <button type="submit" className="btn btn-primary">
              ログイン
            </button>
          </form>
          <button type="button" className="btn btn-ghost mt-3 w-full" onClick={resetDemo}>
            デモデータを初期状態に戻す
          </button>
        </section>

        <section className="surface p-6 md:p-8">
          <h2 className="display mb-2 text-2xl font-extrabold">ワンクリックでロール体験</h2>
          <p className="mb-5 text-sm text-[var(--ink-soft)]">
            提案時のヒアリングで「実際の画面を見たい」にすぐ答えられるよう、3ロール分の導線を用意しています。
          </p>
          <div className="grid gap-3">
            {demos.map((d) => (
              <button
                key={d.role}
                type="button"
                onClick={() => onDemo(d.role)}
                className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-white/70 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand-deep)]">
                  <d.icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-extrabold">{d.title}</span>
                  <span className="mt-0.5 block text-sm text-[var(--ink-soft)]">{d.desc}</span>
                  <span className="mt-1 block text-xs text-[var(--ink-faint)]">{d.email}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
