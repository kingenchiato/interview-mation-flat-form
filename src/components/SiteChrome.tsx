"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";

const links = [
  { href: "/jobs", label: "案件を探す", roles: ["guest", "user"] },
  { href: "/mypage", label: "マイページ", roles: ["user"] },
  { href: "/company", label: "企業管理", roles: ["company"] },
  { href: "/admin", label: "運営管理", roles: ["admin"] },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, logout } = useAppStore();
  const role = user?.role ?? "guest";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(243,247,246,0.78)] backdrop-blur-xl">
      <div className="shell flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--brand),var(--brand-deep))] text-white shadow-[0_8px_18px_rgba(11,107,99,0.28)]">
            <Sparkles size={18} />
          </span>
          <span className="display text-[1.15rem] font-extrabold tracking-tight">
            インタビューコネクト
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links
            .filter((l) => l.roles.includes(role))
            .map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="nav-link text-sm"
                data-active={pathname.startsWith(l.href)}
              >
                {l.label}
              </Link>
            ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <div className="text-sm font-bold">{user.name}</div>
                <div className="text-xs text-[var(--ink-faint)]">
                  {user.role === "user" && "ユーザー"}
                  {user.role === "company" && (user.companyName || "企業")}
                  {user.role === "admin" && "運営"}
                </div>
              </div>
              <button type="button" className="btn btn-ghost !min-h-10 !px-3" onClick={logout}>
                <LogOut size={16} />
                <span className="hidden sm:inline">ログアウト</span>
              </button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary !min-h-10">
              ログイン / デモ体験
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] py-8 text-sm text-[var(--ink-faint)]">
      <div className="shell flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 インタビューコネクト — MVPプロトタイプ</p>
        <p>
          Demo repo:{" "}
          <a
            className="font-semibold text-[var(--brand-deep)] underline-offset-2 hover:underline"
            href="https://github.com/kingenchiato/interview-mation-flat-form"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
