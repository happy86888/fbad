# 🔥 老闆接案學院 AD/BOT

> FB 廣告生成器 v5.0 · 內部專用工具

讓滑到的人停下來、讀完、然後下單。

---

## ✨ 功能特色

- 🌐 **7 種語言**：繁中、簡中、英、日、韓、越、泰
- 📝 **3 切角 × 2 變體** A/B 測試
- 🎬 **DALL-E 直接出圖**
- 🎯 **競品分析**：反推競品策略並建議差異化
- ⭐ **AI 文案評分**：5 維度評估
- 🎥 **影片腳本生成**：Reels / Shorts 30 秒腳本
- ✏️ **編輯模式**：產出後直接微調
- 🔄 **重生單一切角**：省 token
- ❤️ **最愛標記**
- 📁 **品牌資料夾**：多客戶分開管理
- ⚡ **批次生成**：一次跑多個產品
- 📱 **FB 廣告預覽模擬器**
- 📊 **匯出 PDF / Excel**
- 🔒 **通行碼保護** + SEO 屏蔽

---

## 🚀 快速開始

### 本機開發

```bash
# 1. 安裝依賴
npm install

# 2. 啟動開發伺服器
npm run dev

# 3. 打開瀏覽器
# http://localhost:5173
```

### 建置生產版本

```bash
npm run build
# 產出在 dist/ 資料夾,可上傳到任何靜態網站主機
```

---

## 🌐 部署到 Vercel(推薦,1 分鐘搞定)

1. 把這個專案推上 GitHub
2. 前往 [vercel.com](https://vercel.com),用 GitHub 帳號登入
3. 點 **"Add New Project"** → 選擇此 repo
4. Vercel 自動偵測 Vite,直接點 **Deploy**
5. 完成!會得到一個 `xxx.vercel.app` 網址

> 💡 不需要設定任何環境變數。API Key 由使用者自己輸入。

---

## 🌐 部署到 Netlify

1. 推上 GitHub
2. 前往 [netlify.com](https://netlify.com)
3. **"Add new site"** → **"Import from Git"** → 選擇 repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy

---

## 🌐 部署到 GitHub Pages

```bash
# 安裝部署套件
npm install -D gh-pages

# 在 package.json 加:
# "homepage": "https://你的帳號.github.io/adbot-project",
# "scripts": { "deploy": "vite build && gh-pages -d dist" }

npm run deploy
```

---

## 🔐 通行碼

預設通行碼:**`ceobrian`**(不分大小寫)

要改通行碼,編輯 `src/data/constants.js`:

```js
export const ACCESS_CODE = '你的新通行碼';
```

通過後此裝置會**永久記住**,不再要求輸入(直到清除瀏覽器資料或按右上角登出)。

---

## 🤖 OpenAI API 設定

使用者在網站內輸入自己的 API Key,系統會自動儲存到 **瀏覽器 localStorage**(不會傳到任何伺服器)。

### 費用參考

| 服務 | 模型 | 約每次 |
|---|---|---|
| 文案生成 | GPT-4o mini | $0.01 |
| 文案生成 | GPT-4o | $0.05 |
| 圖片生成 | DALL-E 3 | $0.04 |
| 圖片生成 | DALL-E 2 | $0.02 |
| 競品分析 | GPT-4o mini | $0.01 |
| AI 評分 | GPT-4o mini | $0.01 |
| 影片腳本 | GPT-4o mini | $0.02 |

### 如何取得 API Key

1. 前往 https://platform.openai.com/api-keys
2. 點 "Create new secret key"
3. 複製 `sk-...` 開頭的 Key
4. 貼到網站的 API 設定欄

---

## 📁 專案結構

```
adbot-project/
├── public/
│   └── robots.txt              # 屏蔽所有搜尋引擎
├── src/
│   ├── data/
│   │   └── constants.js         # 語氣/語言/模型/通行碼設定
│   ├── templates/               # 內建文案模板(僅繁中)
│   │   ├── headlines.js
│   │   ├── primaryTexts.js
│   │   ├── imagePrompts.js
│   │   └── misc.js
│   ├── services/
│   │   └── openai.js            # OpenAI API 封裝
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   ├── helpers.js
│   │   └── export.js
│   ├── components/              # 13 個 UI 元件
│   │   ├── PasswordGate.jsx
│   │   ├── Header.jsx
│   │   ├── ApiSettings.jsx
│   │   ├── CompetitorAnalysis.jsx
│   │   ├── ConditionForm.jsx
│   │   ├── ResultsSection.jsx
│   │   ├── VariantCard.jsx
│   │   ├── VideoScripts.jsx
│   │   ├── HistoryDrawer.jsx
│   │   ├── TemplatesDrawer.jsx
│   │   ├── BrandManager.jsx
│   │   ├── BatchModal.jsx
│   │   └── FBPreview.jsx
│   ├── App.jsx                  # 主元件
│   ├── main.jsx                 # Entry
│   └── index.css                # Tailwind + 動畫
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 🛠️ 技術棧

- **React 18** — UI 框架
- **Vite 5** — 建置工具(超快)
- **Tailwind CSS 3** — 樣式系統
- **Lucide React** — Icon
- **OpenAI API** — GPT 文案 + DALL-E 圖片

---

## 💾 資料儲存

所有資料都存在使用者的瀏覽器 localStorage,**不會上傳到任何伺服器**:

| Key | 內容 |
|---|---|
| `adbot_unlocked` | 通行碼是否已通過 |
| `adbot_api_key` | OpenAI API Key |
| `adbot_language` | 語言偏好 |
| `adbot_history` | 歷史紀錄(最多 30 筆) |
| `adbot_templates` | 範本(最多 50 個) |
| `adbot_favorites` | 最愛標記 |
| `adbot_brands` | 品牌資料夾 |
| `adbot_current_brand` | 當前品牌 |
| `adbot_scores` | AI 評分結果 |
| `adbot_videos` | 影片腳本 |

---

## ⚠️ 安全提醒

1. **通行碼是前端鎖**:擋一般人 OK,擋懂技術的人不夠。若要更安全,需要做後端驗證。
2. **API Key 存在瀏覽器**:如果公開分享網站,要明確告知使用者必須輸入自己的 Key。
3. **DALL-E 圖片連結 1 小時失效**:出圖後請立刻點下載。

---

## 📜 授權

© 老闆接案學院 · 內部專用,未經授權禁止使用

---

## 🤝 問題回報

如果發現 bug 或想要新功能,直接在 GitHub Issues 提出。
