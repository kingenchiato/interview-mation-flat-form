"use client";

import Image from "next/image";
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
      <section className="hero-bleed">
        <div className="hero-bleed__media">
          <Image
            src="/hero-interview-woman.jpg"
            alt="オンラインインタビューに臨む落ち着いた雰囲気の女性"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="hero-bleed__veil" aria-hidden />
        <motion.div
          className="hero-bleed__content"
          initial={{ opacity: 0.01, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="mb-3 text-sm font-bold tracking-[0.14em] text-white/75">
            企業 × ユーザー インタビューマッチング
          </p>
          <h1>インタビューコネクト</h1>
          <p className="lede">
            あなたの経験が、企業の次の一手になる。募集掲載から応募・日程調整・実施管理までを、必要最低限のMVPで体験できます。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/jobs" className="btn btn-primary">
              案件を探す <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="btn btn-ghost !border-white/30 !bg-white/15 !text-white hover:!bg-white/25">
              3ロールでデモログイン
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="shell py-14">
        <div className="stat-strip mb-10">
          {[
            { icon: Building2, label: "企業", text: "案件作成・選考・日程調整" },
            { icon: Users, label: "ユーザー", text: "応募・事前設問・実施確認" },
            { icon: ShieldCheck, label: "運営", text: "審査・アカウント・案件管理" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="surface p-5"
              initial={{ opacity: 0.2, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <item.icon className="mb-3 text-[var(--brand)]" size={22} />
              <div className="display text-lg font-extrabold">{item.label}</div>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">{item.text}</p>
            </motion.div>
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
