# 株式会社splight コーポレートサイト

## 概要
株式会社splightの公式コーポレートサイトです。エネルギー事業、教育事業、営農事業の3つの事業領域を紹介しています。

## 特徴
- レスポンシブデザイン（モバイル・タブレット・デスクトップ対応）
- 動画背景対応のヒーローセクション
- スムーズなアニメーション効果
- SEO最適化
- アクセシビリティ対応

## 動画背景の設定方法

### 1. 動画ファイルの準備
ヒーローセクションで動画を再生するには、以下の動画ファイルをプロジェクトルートに配置してください：

- `hero-video.mp4` (推奨: H.264エンコード)
- `hero-video.webm` (オプション: より良い圧縮率)

### 2. 推奨動画仕様
- **解像度**: 1920x1080 (Full HD) 以上
- **アスペクト比**: 16:9
- **長さ**: 10-30秒（ループ再生されます）
- **ファイルサイズ**: 5MB以下（読み込み速度のため）
- **フォーマット**: MP4 (H.264 + AAC)

### 3. 動画の最適化
```bash
# FFmpegを使用した動画最適化例
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -c:a aac -b:a 128k -movflags +faststart hero-video.mp4
```

### 4. フォールバック
動画が読み込めない場合、自動的に静止画背景（太陽光パネル画像）が表示されます。

## ファイル構成
```
splight-permanent/
├── index.html          # メインHTMLファイル
├── styles.css          # スタイルシート
├── script.js           # JavaScript
├── app.py             # Flask アプリケーション（デプロイ用）
├── requirements.txt   # Python依存関係
├── Procfile          # デプロイ設定
├── runtime.txt       # Python バージョン
├── hero-video.mp4    # ヒーロー動画（要追加）
├── hero-video.webm   # ヒーロー動画 WebM版（オプション）
└── README.md         # このファイル
```

## ローカル開発

### 静的ファイルサーバーで起動
```bash
python3 -m http.server 8000
```

### Flaskアプリケーションで起動
```bash
python3 app.py
```

## デプロイ
このプロジェクトは以下の環境でデプロイ可能です：
- Heroku
- Vercel
- Netlify
- AWS S3 + CloudFront
- Google Cloud Storage
- 任意のWebサーバー

## ブラウザ対応
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- iOS Safari 11+
- Android Chrome 60+

## パフォーマンス最適化
- 動画の遅延読み込み
- 画像の最適化
- CSS/JSの最小化
- CDN配信対応

## カスタマイズ
- 色やフォントは `styles.css` で変更可能
- 動画制御は `script.js` で調整可能
- コンテンツは `index.html` で編集可能

## ライセンス
© 2025 株式会社splight. All rights reserved.

