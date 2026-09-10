# インタビューコネクト（Interview Connect）

企業 × ユーザーのインタビューマッチングプラットフォーム **MVPプロトタイプ** です。  
クラウドワークス案件「企業×ユーザーのインタビューマッチングプラットフォーム開発」向けの提案デモです。

## オンラインデモ / リポジトリ

- **ライブデモ**: https://kingenchiato.github.io/interview-mation-flat-form/
- **GitHub**: https://github.com/kingenchiato/interview-mation-flat-form
- ローカル起動後、ブラウザで `http://localhost:3000` を開いてください

## デモログイン

| ロール | メール | パスワード |
|--------|--------|------------|
| ユーザー | `user@demo.jp` | `demo1234` |
| 企業 | `company@demo.jp` | `demo1234` |
| 運営 | `admin@demo.jp` | `demo1234` |

ログイン画面のワンクリックボタンでも各ロールに入れます。

## 実装しているMVP機能

### 企業側
- 案件作成・掲載申請
- 応募者確認・選考
- 希望日程からの日程確定（会議URL発行）
- 実施ステータス管理

### ユーザー側
- 会員ログイン / プロフィール編集
- 案件一覧・詳細
- 事前アンケート付き応募
- 応募・実施状況の確認

### 運営側
- 企業・ユーザー一覧
- 掲載審査（承認 / 非承認）
- 案件・応募サマリー

## 技術スタック

- Next.js 16（App Router）
- TypeScript
- Tailwind CSS v4
- Framer Motion
- クライアントサイド状態管理（localStorage）※提案ヒアリング用の動作デモ

## 起動方法

```bash
npm install
npm run dev
```

本番ビルド:

```bash
npm run build
npm start
```

## 推奨デモシナリオ（3分）

1. **ユーザー**でログイン → 案件応募（事前設問 + 希望日程）
2. **企業**でログイン → 応募者を選考通過 → 日程確定
3. **運営**でログイン → 審査待ち案件を承認掲載
4. ユーザーのマイページでステータス変化を確認

## 今後の拡張を見据えた設計メモ

- ロール（user / company / admin）を明確分離
- 案件・応募・ステータスをドメインモデルとして分離
- UIはサーバーAPI接続前提の画面構成（現状はデモ用にローカル永続化）
- 次フェーズで認証（Auth.js / Cognito）、DB（PostgreSQL）、通知、決済・謝礼を追加しやすい構成
