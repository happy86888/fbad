// OpenAI / Groq API 呼叫封裝

const API_ENDPOINTS = {
  openai: 'https://api.openai.com/v1/chat/completions',
  groq: 'https://api.groq.com/openai/v1/chat/completions'
};

const getProvider = (model) => {
  if (model.startsWith('llama') || model.startsWith('mixtral') || model.startsWith('gemma') || model.startsWith('moonshot') || model.startsWith('deepseek') || model.startsWith('qwen')) {
    return 'groq';
  }
  return 'openai';
};

const callChatAPI = async ({ apiKey, model, systemPrompt, userPrompt, temperature = 0.8 }) => {
  const provider = getProvider(model);
  const endpoint = API_ENDPOINTS[provider];

  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature,
    response_format: { type: 'json_object' }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `API 錯誤 (${response.status})`);
  }

  const data = await response.json();
  return {
    parsed: JSON.parse(data.choices[0].message.content),
    usage: data.usage,
    provider
  };
};

// 根據字數長度,回傳對應的結構與要求
const getLengthConfig = (length) => {
  const configs = {
    short: {
      label: '短廣告 (100-150 字)',
      charRange: '100-150 字',
      structure: `**3 段結構(短廣告必用)**:
1. 🔥 鉤子問句 (1-2 行,emoji 開頭,直擊痛點)
2. 痛點 + 解法 (3-4 行)
3. ✨ CTA 行動呼籲 (1 行,emoji 開頭)

短廣告範例(以型錄印刷為例):
---
🔥 你的產品很強,但客戶看得懂嗎?

當技術太複雜,連業務都解釋不清楚。
我們從攝影開始,讓零件、機台、工廠 — 看得見專業。
專為製造業打造,展會、官網、提案都能用。

✨ 想被國際客戶一眼記住?現在聊聊。
---`
    },
    medium: {
      label: '中廣告 (250-400 字)',
      charRange: '250-400 字',
      structure: `**5 段結構(中廣告必用)**:
1. 🔥 鉤子問句 (1-2 行)
2. 痛點深挖 (3-4 行,具體場景化)
3. 💡 我們的解法 (3-4 行)
4. 🎯 服務/產品定位 (2-3 行)
5. ✨ CTA 行動呼籲 (1 行)

中廣告範例(以型錄印刷為例):
---
🔥 你的產品很強,但客戶第一眼看到的是什麼?

從零件製造,到整廠設備輸出,
當產品越專業,越需要被「清楚呈現」。
問題往往不在技術,而是 — 你怎麼被看見。

💡 很多型錄不夠有說服力,
不是設計問題,而是照片撐不起來。
我們從「攝影」開始,
讓機台更有份量、零件更有質感、工廠更有信任感。

🎯 專業型錄設計|讓客戶一看就懂,一看就想問
專為製造業與國際展會打造,
把複雜的產品與技術,轉換成客戶看得懂的資訊。

✨ 想讓國際客戶一眼看懂你的實力?現在就聊聊。
---`
    },
    long: {
      label: '長廣告 (400-600 字)',
      charRange: '400-600 字',
      structure: `**完整 7 段結構(長廣告必用)**:
1. 🔥 鉤子問句
2. 痛點深挖 (3-4 行)
3. 💡 我們的解法 (3-4 行)
4. 🎯 服務/產品定位 (2-3 行)
5. 差異化價值 (2-3 行)
6. ⚡ 服務組合 (1-2 行)
7. ✨ CTA 行動呼籲

長廣告範例(以型錄印刷為例,完整呈現):
---
🔥 你的產品很強,但客戶第一眼看到的是什麼?

從零件製造,到整廠設備輸出,
當產品越專業,越需要被「清楚呈現」。
問題往往不在技術,而是 — 你怎麼被看見。

💡 很多型錄不夠有說服力,
不是設計問題,而是照片撐不起來。

我們從「攝影」開始,
讓機台更有份量、零件更有質感、工廠更有信任感。
讓品質不只是口說,而是「看得見」。

🎯 專業型錄設計|讓客戶一看就懂,一看就想問
專為製造業與國際展會打造,
把複雜的產品與技術,轉換成客戶看得懂的資訊。

我們不只是做型錄
我們是在幫你把產品「重新包裝成市場看得懂的價值」。

⚡ 公司名稱|型錄 × 攝影 × 包裝整合
從拍攝、設計到印刷,一體完成。

✨ 想讓國際客戶一眼看懂你的實力?現在就聊聊。
---`
    }
  };
  return configs[length] || configs.medium;
};

// 1. 生成廣告文案
export const generateAds = async ({
  apiKey, model, industry, productName, targetAudience, tone, goal,
  language, langName, competitorAnalysis,
  length = 'medium'
}) => {
  const lengthCfg = getLengthConfig(length);

  const competitorContext = competitorAnalysis ? `

## 競品策略參考
- 策略總結:${competitorAnalysis.summary}
- 他們戳的痛點:${competitorAnalysis.painPoints.join('、')}
- 他們的弱點:${competitorAnalysis.weaknesses.join('、')}
- 我們的差異化:${competitorAnalysis.ourAdvantages.join('、')}
- 建議切角:${competitorAnalysis.recommendedAngles.join('、')}

請參考這份競品分析,讓文案在差異化點上突出。` : '';

  const systemPrompt = `你是頂尖的 Facebook 廣告文案專家,專門寫「看完就想下單」的高轉換信息流廣告。

## 🎯 你要寫的是 FB 信息流廣告,不是官網文案

FB 廣告的特性:
- 滑手機時插隊出現,3 秒抓住眼球
- 必須有清楚的結構與節奏
- 用 emoji 做段落分隔(🔥 💡 🎯 ✨ ⚡ 等)
- 一段話一個重點

## ⚠️ 嚴禁產出
❌「我們擁有多年經驗,提供高品質服務,歡迎來電」這種官網介紹詞
❌「我們的產品具備 XX 特色」這種乾巴巴的介紹
❌ 沒有結構、沒有 emoji 的純文字段落
❌ 套用「3 年訪談 500 位專家」這類課程式銷售口吻(除非真的賣課程)

## 📏 本次字數與結構要求

**字數規範:${lengthCfg.charRange}** (必須達到)

${lengthCfg.structure}

## 🌍 跨產業適配 — 重要!

上面範例是型錄印刷(B2B 服務),但**你要寫的可能是任何產業**。請依下表自動切換語氣:

| 產業類型 | 鉤子方向 | 痛點 | 解法 | CTA |
|---|---|---|---|---|
| B2B 服務 / 製造 / 印刷 | 你的XX強,但客戶看得懂嗎? | 解釋不清、被誤解 | 整合服務、視覺呈現 | 預約諮詢、聊聊 |
| B2C 實體 (家具/家電/服飾) | 你的家/穿搭,還在將就嗎? | 將就太久、選擇困難 | 細節質感、用很久 | 立即購買、來看看 |
| 餐飲 / 食品 | 上次讓你回味的一餐是什麼時候? | 外食千篇一律 | 食材/工法/堅持 | 訂位、來店、外帶 |
| 健身 / 醫美 / 美容 | 鏡中的自己,你還喜歡嗎? | 試過卻沒效、不敢改變 | 教練/技術/陪伴 | 免費諮詢、預約 |
| 教育 / 補習 | 為什麼別人的孩子總是領先? | 不知方向、不知方法 | 系統化教學、見證 | 試聽、預約諮詢 |
| 寵物 / 育兒用品 | 你的毛孩/孩子值得更好嗎? | 安全擔憂、不知挑什麼 | 嚴選/獸醫/兒科背書 | 立即購買 |
| 房地產 / 高單價 | 下班回家最期待什麼? | 通勤累、空間不夠 | 地段/格局/未來性 | 預約賞屋 |
| 服務業 (美髮/美甲/SPA) | 累的時候怎麼讓自己回血? | 沒時間、品質參差 | 設計師/環境/體驗 | 立即預約 |

**根據使用者輸入的「產業 + 產品」,自動判斷它屬於哪一類,套用對應語氣。**

## 💎 寫作關鍵原則

1. 用「你 vs 我們」對話視角,像私訊聊天
2. 講具體場景,不是抽象形容詞
   ❌「高品質」→ ✅「用 3 年依然像新的」
   ❌「精緻美味」→ ✅「咬下去那一口會閉眼那種」
3. 痛點戳深,寫客戶心裡那句沒說出口的話
4. emoji 不是裝飾,是段落視覺切割工具
5. CTA 符合產業:實體商品「立即購買」、服務「預約諮詢」、餐飲「立即訂位」
6. 每段一個重點

## 🎬 圖片 Prompt 要求(英文)

- 電影感、情緒瞬間、光線是主角
- 場景符合產業(製造業→工廠特寫;餐飲→餐桌瞬間;家具→客廳生活)
- 避免:笑臉直視鏡頭、產品正中央、乾淨白底

## 📝 任務

產業:${industry}
產品/服務:${productName}
目標受眾:${targetAudience}
語氣:${tone}
目標:${goal}
語言:${langName}
長度:${lengthCfg.label}${competitorContext}

請產出 3 組不同切角,每組 A/B 共 6 個版本:

1. **故事開場 · 情境帶入型**:用客戶真實場景開頭
2. **痛點剖析 · 自我對話型**:用直接問痛點開頭
3. **見證轉變 · 社會認同型**:用客戶見證或數據開頭

A/B 兩版差異:不同鉤子、不同強調、不同結構順序

## 📋 回覆格式(只回 JSON,不要 markdown)

{
  "copies": [
    {
      "style": "(切角名稱,${langName})",
      "variants": [
        {
          "label": "A 版",
          "headline": "(主標題 25-40 字)",
          "primary": "(主要文字 ${lengthCfg.charRange},emoji 分段,完整結構)",
          "description": "(描述 30 字內)",
          "cta": "(CTA 符合產業)",
          "imagePrompt": "(英文)",
          "imageDirection": "(${langName})"
        },
        { "label": "B 版", ... }
      ]
    },
    { ... }, { ... }
  ]
}

⚠️ 嚴格檢查:每篇 primary 必須達到 ${lengthCfg.charRange},不能偷工。`;

  const userPrompt = `產業:${industry}
產品/服務:${productName}
目標受眾:${targetAudience}
語氣:${tone}
目標:${goal}
語言:${langName}
文案長度:${lengthCfg.label}

⚠️ 嚴格要求:
1. primary 必須 **${lengthCfg.charRange}**
2. 必須 emoji 分段
3. 必須符合「${industry}」的真實產業情境(不要套用其他產業的口吻)
4. 千萬不要寫「我們是一家專業的 XX,擁有多年經驗」這種短文官網介紹

請產出有衝擊力的 FB 信息流廣告。`;

  return await callChatAPI({ apiKey, model, systemPrompt, userPrompt, temperature: 0.85 });
};

// 2. 競品分析
export const analyzeCompetitor = async ({ apiKey, model, urls, text, industry, product }) => {
  const sysPrompt = `你是資深廣告策略分析師,擅長從競品的文案與視覺反推他們的行銷策略。

請以 JSON 回覆:
{
  "summary": "整體策略總結 (2-3 句)",
  "tone": "語氣與調性",
  "targetAudience": "推測的目標受眾",
  "hookStrategy": "鉤子策略",
  "painPoints": ["痛點 1", "痛點 2", "痛點 3"],
  "valueProps": ["價值 1", "價值 2", "價值 3"],
  "ctaStrategy": "CTA 策略",
  "visualStyle": "視覺風格",
  "weaknesses": ["弱點 1", "弱點 2"],
  "ourAdvantages": ["差異化 1", "差異化 2", "差異化 3"],
  "recommendedAngles": ["切角 1", "切角 2", "切角 3"]
}

分析要深入、具體、可執行。只回 JSON。`;

  const userPrompt = `競品連結:
${urls || '(未提供)'}

競品文案:
${text || '(未提供)'}

我們的產業:${industry || '(未填)'}
我們的產品:${product || '(未填)'}`;

  return await callChatAPI({ apiKey, model, systemPrompt: sysPrompt, userPrompt, temperature: 0.7 });
};

// 3. 重新生成單一切角
export const regenerateAngle = async ({ apiKey, model, generated, copyIdx, langName, length = 'medium' }) => {
  const angle = generated.copies[copyIdx];
  const lengthCfg = getLengthConfig(length);

  const sysPrompt = `你是頂尖 FB 信息流廣告文案專家。重新為這個切角產出 2 個新變體,字數: ${lengthCfg.charRange}。

${lengthCfg.structure}

**所有文字用 ${langName},圖片 prompt 用英文,emoji 分段**

回覆 JSON:
{
  "style": "${angle.style}",
  "variants": [
    {
      "label": "A 版",
      "headline": "...", "primary": "(${lengthCfg.charRange},emoji 分段)",
      "description": "...", "cta": "...",
      "imagePrompt": "(英文)", "imageDirection": "(${langName})"
    },
    { "label": "B 版", ... }
  ]
}

跟舊版完全不同的切角:
${JSON.stringify(angle.variants.map(v => ({ headline: v.headline, primary: v.primary.slice(0, 80) })))}`;

  const userPrompt = `產業:${generated.industry}
產品:${generated.productName}
目標受眾:${generated.targetAudience}
語氣:${generated.tone}
目標:${generated.goal}
切角:${angle.style}
語言:${langName}
長度:${lengthCfg.label}

請產出 2 個全新變體,跟舊版不同切入點,符合字數要求。`;

  return await callChatAPI({ apiKey, model, systemPrompt: sysPrompt, userPrompt, temperature: 0.95 });
};

// 4. AI 評分
export const scoreAds = async ({ apiKey, model, generated }) => {
  const allVariants = [];
  generated.copies.forEach((copy, ci) => {
    copy.variants.forEach((v, vi) => {
      allVariants.push({
        id: `${ci}-${vi}`,
        angle: copy.style,
        label: v.label,
        headline: v.headline,
        primary: v.primary
      });
    });
  });

  const sysPrompt = `你是資深 FB 廣告投放優化師,精通評估文案的轉換力。

請為每組文案打分(1-10):
1. hookStrength (鉤子強度)
2. emotion (情感濃度)
3. clarity (訊息清晰)
4. cta (CTA 力道)
5. uniqueness (差異化)

並給出 overall(加權總分)、strengths、weaknesses、suggestion。

回覆格式:
{
  "scores": [
    {
      "id": "0-0", "hookStrength": 8, "emotion": 7, "clarity": 9, "cta": 6, "uniqueness": 7, "overall": 7.4,
      "strengths": "...", "weaknesses": "...", "suggestion": "..."
    }
  ],
  "bestId": "X-Y",
  "summary": "整體分析 (2-3 句)"
}

只回 JSON。`;

  return await callChatAPI({
    apiKey, model,
    systemPrompt: sysPrompt,
    userPrompt: `請評分以下 ${allVariants.length} 組文案:\n\n${JSON.stringify(allVariants, null, 2)}`,
    temperature: 0.3
  });
};

// 5. 影片腳本
export const generateVideoScripts = async ({ apiKey, model, generated, langName }) => {
  const sysPrompt = `你是 IG Reels / TikTok / YouTube Shorts 短影音腳本專家。

**用 ${langName} 撰寫。**

為每組廣告文案改寫成 30 秒影片腳本,包含 hook、scenes、cta、musicMood、caption。

回覆 JSON:
{
  "scripts": [
    {
      "angle": "...",
      "hook": "...",
      "scenes": [{ "timeRange": "3-8s", "visual": "...", "voiceover": "...", "bRoll": "..." }],
      "cta": "...",
      "musicMood": "...",
      "caption": "..."
    }
  ]
}

只回 JSON。`;

  const userPrompt = `產業:${generated.industry}
產品:${generated.productName}
語氣:${generated.tone}
語言:${langName}

以下是 3 組廣告文案,改寫成 30 秒短影音腳本:

${generated.copies.map((c, i) => `\n--- 第 ${i + 1} 組:${c.style} ---\n${c.variants[0].headline}\n${c.variants[0].primary}`).join('\n')}`;

  return await callChatAPI({ apiKey, model, systemPrompt: sysPrompt, userPrompt, temperature: 0.8 });
};

// 6. DALL-E 出圖
export const generateImage = async ({ apiKey, imageModel, prompt }) => {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: imageModel,
      prompt,
      n: 1,
      size: imageModel === 'dall-e-3' ? '1024x1024' : '512x512',
      quality: imageModel === 'dall-e-3' ? 'standard' : undefined
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `圖片 API 錯誤 (${response.status})`);
  }

  const data = await response.json();
  return data.data[0].url;
};
