# Design Patterns Visualizer

https://tap1ra.github.io/design-patterns/

インタラクティブに学べるデザインパターンの可視化学習ツールです。TypeScriptとViteで構築されており、GoF（Gang of Four）の代表的なデザインパターンをブラウザ上で直感的に操作しながら学ぶことができます。

# 本プロジェクトはGoogle Antigravityでどういったものが作成可能かを知るため、AIを用いて作成した学習用のサンプルですħ

## ✨ 特徴

* **9つのデザインパターンを収録**: Observer, State, Strategy, Singleton, Factory, Command, Decorator, Builder, Facade を網羅。
* **直感的なデモ**: 日常生活のわかりやすい例（自動販売機、コーヒーのトッピング、ショッピングカートなど）を用いて各パターンの仕組みを解説。
* **リアルタイム・コード連動**: 「並列表示」モードを使用すると、デモ画面のボタン操作に連動して、右側のTypeScriptコードの該当箇所（実行されているメソッド）がリアルタイムにハイライトされます。
* **シンプルで軽量**: 外部のUIフレームワーク（ReactやVueなど）に依存せず、生のTypeScriptとVanilla CSSのみで実装されているため、パターンの純粋な構造を理解しやすくなっています。

## 🛠️ 使用技術

* **言語**: TypeScript, HTML5
* **スタイリング**: Vanilla CSS (CSS Variables, Flexbox, CSS Grid)
* **ビルドツール**: Vite

## 🚀 ローカルでの起動方法

Node.js（推奨: v22以上）がインストールされている環境で、以下のコマンドを実行してください。

```bash
# 1. 依存関係のインストール
npm install

# 2. 開発サーバーの起動
npm run dev
```

コマンド実行後、ブラウザで `http://localhost:5173/` にアクセスするとアプリケーションが開きます。

## 📁 プロジェクト構造

* `src/main.ts`: アプリケーションのエントリポイント・ルーティング処理
* `src/index.css`: アプリケーション全体のスタイリング（各パターンの共通UIコンポーネント含む）
* `src/patterns/`: 各デザインパターンの実装ディレクトリ
  * `[PatternName].ts`: パターンの核となるTypeScriptのインターフェースやクラス群
  * `[PatternName]View.ts`: パターンを操作・可視化するためのUI制御ロジック
* `src/utils/CodeViewer.ts`: コード表示およびリアルタイムハイライト機能の制御ユーティリティ

## 📝 ライセンス

このプロジェクトは学習用途のオープンソースソフトウェアです。自由に改変してご利用いただけます。
