import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "インタビューコネクト | 企業×ユーザーのインタビューマッチング",
  description:
    "企業がインタビュー案件を掲載し、ユーザーが応募・日程調整まで完結できるマッチングプラットフォームのMVPプロトタイプです。",
  openGraph: {
    title: "インタビューコネクト MVP Prototype",
    description: "企業・ユーザー・運営の3ロール対応インタビューマッチング基盤",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Noto+Sans+JP:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
