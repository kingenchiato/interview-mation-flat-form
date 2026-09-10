"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  ShieldCheck,
  Users,
} from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { useAppStore } from "@/lib/store";

export default function HomePage() {
  const { jobs } = useAppStore();
  const published = jobs.filter((j) => j.status === "published").slice(0, 3);

  return (
    <div>
      <section className="shell hero-grid">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="fade-up"
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 text-xs font-bold text-[var(--brand-deep)]">
            MVPプロトタイプ / ユニーリサーチ型マッチング
          </p>
          <h1 className="display mb-4 text-[clamp(2.4rem,6vw,4.2rem)] font-extrabold leading-[1.08] tracking-[-0.04em]">
            インタビューコネクト
          </h1>
          <p className="mb-2 max-w-xl text-[clamp(1.15rem,2.4vw,1.55rem)] font-bold leading-snug text-[var(--ink)]">
            企業の声を集めたい気持ちと、経験を共有したい人をつなぐ。
          </p>
          <p className="mb-8 max-w-xl text-[var(--ink-soft)] leading-relaxed">
            案件掲載・スクリーニング応募・選考・日程調整・実施管理までを、必要最小限の導線で体験できるデモです。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/jobs" className="btn btn-primary">
              案件を探す <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="btn btn-accent">
              3ロールでデモログイン
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="mesh-panel relative p-6"
        >
          <div className="mb-8 max-w-sm">
            <p className="mb-2 text-sm font-semibold text-white/75">ライブ感のあるマッチング体験</p>
            <h2 className="display text-3xl font-extrabold leading-tight">
              募集から実施完了まで、ひと続きのワークフロー
            </h2>
          </div>
          <div className="floating-card left-6 top-[48%] max-w-[220px]">
            <div className="mb-1 text-xs text-white/70">応募者</div>
            <div className="font-bold">佐藤 美咲 / 東京都</div>
            <div className="mt-1 text-sm text-white/80">事前設問 3/3 回答済</div>
          </div>
          <div className="floating-card right-5 top-[28%] max-w-[200px]">
            <div className="mb-1 text-xs text-white/70">謝礼</div>
            <div className="display text-2xl font-extrabold">¥6,000</div>
            <div className="text-sm text-white/80">60分 / Google Meet</div>
          </div>
          <div className="floating-card bottom-6 right-8 max-w-[230px]">
            <div className="mb-1 text-xs text-white/70">ステータス</div>
            <div className="font-bold">日程確定 → 実施待ち</div>
            <div className="mt-1 text-sm text-white/80">9/14 15:00</div>
          </div>
        </motion.div>
      </section>

      <section className="shell pb-14">
        <div className="stat-strip mb-10">
          {[
            { icon: Building2, label: "企業", text: "案件作成・選考・日程調整" },
            { icon: Users, label: "ユーザー", text: "応募・事前設問・実施確認" },
            { icon: ShieldCheck, label: "運営", text: "審査・アカウント・案件管理" },
          ].map((item) => (
            <div key={item.label} className="surface p-5">
              <item.icon className="mb-3 text-[var(--brand)]" size={22} />
              <div className="display text-lg font-extrabold">{item.label}</div>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="section-title">
          <h2>いま募集中のインタビュー</h2>
          <p>実サービスに近い案件カードUIで、謝礼・条件・応募状況が一目でわかります。</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {published.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        <div className="mt-6">
          <Link href="/jobs" className="btn btn-ghost">
            すべての案件を見る
          </Link>
        </div>
      </section>

      <section className="shell pb-16">
        <div className="surface grid gap-8 p-6 md:grid-cols-2 md:p-8">
          <div>
            <div className="section-title">
              <h2>MVPで実装している範囲</h2>
              <p>クライアント要件を「すぐ価値が出る最小セット」に整理しています。</p>
            </div>
            <ul className="space-y-3 text-sm text-[var(--ink-soft)]">
              {[
                "企業アカウント / 案件作成 / 掲載審査",
                "ユーザー登録・プロフィール・案件閲覧",
                "事前アンケート付き応募フロー",
                "応募者選定・日程候補提示・確定",
                "実施ステータス管理（企業・ユーザー・運営）",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--brand)]" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-[linear-gradient(160deg,#084f49,#0b6b63)] p-6 text-white">
            <ClipboardList className="mb-3" />
            <h3 className="display mb-2 text-2xl font-extrabold">デモの始め方</h3>
            <ol className="space-y-2 text-sm text-white/85">
              <li>1. 「3ロールでデモログイン」からユーザー / 企業 / 運営を選択</li>
              <li>2. ユーザーで案件応募 → 企業で選考・日程確定 → 運営で審査</li>
              <li>3. データはブラウザ内に保存（リセット可能）</li>
            </ol>
            <Link href="/login" className="btn mt-5 bg-white text-[var(--brand-deep)] hover:bg-white/95">
              デモを開始する
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
