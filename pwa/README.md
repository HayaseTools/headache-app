# MigraLog (PWA)

## 起動

1. プロジェクトルートで以下を実行
   - `npm run pwa`
2. ブラウザで `http://localhost:4173/pwa/` を開く

## 実装済み要件

- 頭痛記録（日時・強度・部位・服薬・メモ + 任意の睡眠/飲水/生理周期）
- Open-Meteo連携（緯度経度のみ送信）
- 天気相関グラフ + 強度トレンド
- TensorFlow.js ローカル学習/予測（`localStorage://` 保存）
- カレンダー連携（.ics出力、Google/Outlookディープリンク）
- 月次サマリーとPDFエクスポート
- ダークモード、モバイル最適化、PWAインストール
- ローカルバックアップ/復元

## プライバシー

- 記録データは `localStorage` のみ使用（端末外へ送信しない）
- 外部通信は Open-Meteo API のみ（緯度経度と天気パラメータ）
- AIモデルはブラウザ内で学習・推論し、端末内保存

## ストア展開の次ステップ

- iOS/Android: Capacitor または TWA でラップして審査提出
- Windows/Mac: Electron/Tauri でデスクトップ版を同一UIで配布
- カレンダーの完全API連携（OAuth）はストア審査用ポリシー文言を追加
