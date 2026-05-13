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

// 計算字數
const countChars = (text) => {
  if (!text) return 0;
  const cjkMatch = text.match(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g) || [];
  const englishWords = text.replace(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g, ' ').split(/\s+/).filter(w => w.length > 0);
  return cjkMatch.length + englishWords.length;
};

const getLengthRange = (length) => {
  const ranges = {
    short: { min: 100, max: 150 },
    medium: { min: 250, max: 400 },
    long: { min: 400, max: 600 },
  };
  return ranges[length] || ranges.medium;
};

const isCopyLengthValid = (copies, length) => {
  const { min } = getLengthRange(length);
  const threshold = Math.floor(min * 0.8);
  for (const copy of copies) {
    for (const variant of copy.variants) {
      if (countChars(variant.primary) < threshold) {
        return false;
      }
    }
  }
  return true;
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
3. ✨ CTA 行動呼籲 (1 行,emoji 開頭)`
    },
    medium: {
      label: '中廣告 (250-400 字)',
      charRange: '250-400 字',
      structure: `**5 段結構(中廣告必用)**:
1. 🔥 鉤子問句
2. 痛點深挖 (3-4 行)
3. 💡 我們的解法 (3-4 行)
4. 🎯 服務/產品定位 (2-3 行)
5. ✨ CTA 行動呼籲`
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
7. ✨ CTA 行動呼籲`
    }
  };
  return configs[length] || configs.medium;
};

// ============================================================
// 🆕 步驟 1:分析產業並產出「廣告調性配方」
// ============================================================
export const analyzeIndustry = async ({
  apiKey, model, industry, productName, targetAudience, langName
}) => {
  const sysPrompt = `你是資深行銷顧問,專長是「行業適配分析」。

你的任務:根據使用者輸入的產業,產出一份「廣告調性配方」,讓後續的文案 AI 能精準寫出該產業的高轉換廣告。

## 分析要包含 4 個維度

1. **hookDirection** (鉤子方向):這個產業的客戶,什麼問題會讓他們停下來?
   範例:「你的家,真的住得舒服嗎?」「上次讓你回味的一餐是什麼時候?」

2. **painPoints** (痛點清單):客戶在這個產業最常遇到的真實痛點(3-5 個)
   範例(室內設計):「預算疑慮、怕被加價、設計師不懂自己、施工品質難掌握、找不到適合的風格」

3. **solutionAngle** (解法切角):這個產業的廣告通常用什麼方式說服客戶?
   範例(室內設計):「客製化、量身打造、十年保固、施工透明、設計師深度諮詢」

4. **ctaDirection** (CTA 方向):這個產業最有效的行動呼籲類型
   範例(室內設計):「預約丈量、免費諮詢、案例賞析、設計提案」

## 重要原則

- 要**具體**,不要寫「高品質、專業服務」這種空話
- 要**真實**,寫客戶心裡那句沒說出口的話
- **不要套用其他產業的口吻**,例如不要把家具寫成課程口吻
- 即使是冷門產業(殯葬、占卜、會計師事務所、農產品等),也要認真分析

## 回覆格式(用 ${langName},只回 JSON,不要 markdown)

{
  "industryCategory": "(這個產業屬於哪一類:B2B 服務 / B2C 實體商品 / 餐飲 / 服務業 / 教育 / 醫美 / 房地產 / 高單價諮詢...等,用 ${langName})",
  "hookDirection": "(這類產業的客戶會被什麼問題勾住?用 ${langName})",
  "painPoints": ["痛點 1", "痛點 2", "痛點 3", "痛點 4"],
  "solutionAngle": "(這類產業適合用什麼解法說服?用 ${langName})",
  "ctaDirection": "(這類產業最有效的 CTA 用詞,用 ${langName})",
  "writingStyle": "(這類產業文案的整體調性建議,例如:溫馨、專業、急迫感、信任感等,用 ${langName})"
}`;

  const userPrompt = `產業:${industry}
產品/服務:${productName || '未指定'}
目標受眾:${targetAudience || '未指定'}

請產出這個產業的廣告調性配方。`;

  return await callChatAPI({ apiKey, model, systemPrompt: sysPrompt, userPrompt, temperature: 0.5 });
};

// ============================================================
// 步驟 2:依照「產業配方」產出文案(generateAds 強化版)
// ============================================================
export const generateAds = async ({
  apiKey, model, industry, productName, targetAudience, tone, goal,
  language, langName, competitorAnalysis,
  length = 'medium',
  customTone = '',
  customGoal = '',
  customBrief = '',
  industryProfile = null,  // 步驟 1 產出的配方,若有就用,沒有就走快速模式
  userIndustryRef = ''     // 🆕 使用者自己填寫的產業參考(優先級最高)
}) => {
  const lengthCfg = getLengthConfig(length);
  const { min, max } = getLengthRange(length);

  const finalTone = tone === '自訂' && customTone ? customTone : tone;
  const finalGoal = goal === '自訂' && customGoal ? customGoal : goal;

  const competitorContext = competitorAnalysis ? `

## 競品策略參考
- 策略總結:${competitorAnalysis.summary}
- 他們戳的痛點:${competitorAnalysis.painPoints.join('、')}
- 我們的差異化:${competitorAnalysis.ourAdvantages.join('、')}` : '';

  const briefContext = customBrief ? `

## 🔥 客戶的特別訴求(最高優先級,必須遵守)
${customBrief}

⚠️ 以上是客戶親自寫的訴求,優先級高於其他通則。請務必體現。` : '';

  // 🆕 產業參考(優先順序: 使用者填的 > AI 分析的 > 內建表)
  let industryContext = '';
  if (userIndustryRef && userIndustryRef.trim()) {
    industryContext = `

## 🎯 客戶提供的產業特性參考(最高優先級)
${userIndustryRef}

⚠️ 請依照客戶提供的這份產業特性寫文案,鉤子方向、痛點、解法、CTA 都要與此一致。`;
  } else if (industryProfile) {
    industryContext = `

## 🎯 本次廣告的產業配方(已分析)
- 產業類型:${industryProfile.industryCategory}
- 鉤子方向:${industryProfile.hookDirection}
- 客戶痛點:${industryProfile.painPoints.join('、')}
- 解法切角:${industryProfile.solutionAngle}
- CTA 方向:${industryProfile.ctaDirection}
- 文案調性:${industryProfile.writingStyle}

⚠️ 請嚴格依照這份配方寫文案,鉤子、痛點、解法、CTA 都要對應到這份配方。`;
  } else {
    // 沒有配方時用內建快速對照表
    industryContext = `

## 🌍 產業適配參考表(快速模式)

| 產業類型 | 鉤子方向 | 痛點 | 解法 | CTA |
|---|---|---|---|---|
| B2B 服務 / 製造 / 印刷 | 你的XX強,但客戶看得懂嗎? | 解釋不清、被誤解 | 整合服務、視覺呈現 | 預約諮詢、聊聊 |
| B2C 實體 (家具/家電/服飾) | 你的家/穿搭,還在將就嗎? | 將就太久、選擇困難 | 細節質感、用很久 | 立即購買、來看看 |
| 室內設計 / 裝潢 | 你的家,真的住得舒服嗎? | 預算疑慮、設計師不懂自己 | 客製化、量身打造、十年保固 | 預約丈量、免費諮詢 |
| 餐飲 / 食品 | 上次讓你回味的一餐是什麼時候? | 外食千篇一律 | 食材/工法/堅持 | 訂位、來店、外帶 |
| 健身 / 醫美 / 美容 | 鏡中的自己,你還喜歡嗎? | 試過卻沒效、不敢改變 | 教練/技術/陪伴 | 免費諮詢、預約 |
| 教育 / 補習 | 為什麼別人的孩子總是領先? | 不知方向、不知方法 | 系統化教學、見證 | 試聽、預約諮詢 |
| 寵物 / 育兒用品 | 你的毛孩/孩子值得更好嗎? | 安全擔憂、不知挑什麼 | 嚴選/獸醫/兒科背書 | 立即購買 |
| 房地產 / 高單價 | 下班回家最期待什麼? | 通勤累、空間不夠 | 地段/格局/未來性 | 預約賞屋 |
| 服務業 (美髮/美甲/SPA) | 累的時候怎麼讓自己回血? | 沒時間、品質參差 | 設計師/環境/體驗 | 立即預約 |

請根據使用者輸入的產業,自動判斷它最接近哪一類,套用對應語氣。
若都不像,自己依產業真實情境推論。`;
  }

  const systemPrompt = `你是頂尖的 Facebook 廣告文案專家,專門寫「看完就想下單」的高轉換信息流廣告。

## 🎯 你要寫的是 FB 信息流廣告,不是官網文案

特性:滑手機時插隊出現,3 秒抓住眼球,必須有清楚的結構與節奏,用 emoji 做段落分隔。

## ⚠️ 嚴禁產出
❌「我們擁有多年經驗,提供高品質服務,歡迎來電」這種官網介紹詞
❌「我們的產品具備 XX 特色」這種乾巴巴的介紹
❌ 沒有結構、沒有 emoji 的純文字段落
❌ 套用「3 年訪談 500 位專家」這類課程式銷售口吻(除非真的賣課程)

## 📏 ⚡ 字數規範(最重要)⚡

**必須 ${min}-${max} 字,最低門檻 ${min} 字。**
不夠就多寫場景描述、痛點延伸、解法細節。

${lengthCfg.structure}${industryContext}

## 💎 寫作關鍵原則

1. 用「你 vs 我們」對話視角
2. 講具體場景,不是抽象形容詞
3. 痛點戳深,寫客戶心裡那句沒說出口的話
4. emoji 不是裝飾,是段落視覺切割工具
5. CTA 符合產業
6. 每段一個重點${briefContext}

## 🎬 圖片 Prompt 要求(英文)

電影感、情緒瞬間、光線是主角、場景符合產業,避免笑臉直視鏡頭、產品正中央、乾淨白底。

## 📝 任務

產業:${industry}
產品/服務:${productName}
目標受眾:${targetAudience}
語氣:${finalTone}
目標:${finalGoal}
語言:${langName}
長度:${lengthCfg.label} (必須 ${min}-${max} 字)${competitorContext}

請產出 3 組不同切角,每組 A/B 共 6 個版本:

1. **故事開場 · 情境帶入型**:用客戶真實場景開頭
2. **痛點剖析 · 自我對話型**:用直接問痛點開頭
3. **見證轉變 · 社會認同型**:用客戶見證或數據開頭

## 📋 回覆格式(只回 JSON)

{
  "copies": [
    {
      "style": "(切角名稱,${langName})",
      "variants": [
        {
          "label": "A 版",
          "headline": "(主標題 25-40 字)",
          "primary": "(主要文字 ${min}-${max} 字,emoji 分段)",
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

⚠️ 嚴格檢查:每篇 primary 必須 ${min}-${max} 字。`;

  const userPrompt = `產業:${industry}
產品/服務:${productName}
目標受眾:${targetAudience}
語氣:${finalTone}
目標:${finalGoal}
語言:${langName}
文案長度:${lengthCfg.label}

⚠️ 字數規範:必須 ${min}-${max} 字!

${customBrief ? `客戶的特別訴求:\n${customBrief}\n\n` : ''}請產出有衝擊力的 FB 信息流廣告。`;

  // 第一次嘗試
  let result = await callChatAPI({ apiKey, model, systemPrompt, userPrompt, temperature: 0.85 });

  // 字數不夠自動重試
  if (!isCopyLengthValid(result.parsed.copies, length)) {
    console.log('字數不達標,自動重試');
    const retryUserPrompt = `${userPrompt}

⚠️ 重要:上次產出字數太少,這次請務必每篇 primary 達到 ${min}-${max} 字。
多增加場景描述、痛點細節、解法說明。`;
    try {
      result = await callChatAPI({ apiKey, model, systemPrompt, userPrompt: retryUserPrompt, temperature: 0.9 });
    } catch (e) {
      console.error('重試失敗', e);
    }
  }

  return result;
};

// 競品分析
export const analyzeCompetitor = async ({ apiKey, model, urls, text, industry, product }) => {
  const sysPrompt = `你是資深廣告策略分析師。請以 JSON 回覆:
{
  "summary": "整體策略總結",
  "tone": "語氣調性",
  "targetAudience": "推測目標受眾",
  "hookStrategy": "鉤子策略",
  "painPoints": ["痛點 1", "痛點 2", "痛點 3"],
  "valueProps": ["價值 1", "價值 2", "價值 3"],
  "ctaStrategy": "CTA 策略",
  "visualStyle": "視覺風格",
  "weaknesses": ["弱點 1", "弱點 2"],
  "ourAdvantages": ["差異化 1", "差異化 2", "差異化 3"],
  "recommendedAngles": ["切角 1", "切角 2", "切角 3"]
}
分析要深入、具體。只回 JSON。`;

  const userPrompt = `競品連結:\n${urls || '(未提供)'}\n\n競品文案:\n${text || '(未提供)'}\n\n我們的產業:${industry || '(未填)'}\n我們的產品:${product || '(未填)'}`;

  return await callChatAPI({ apiKey, model, systemPrompt: sysPrompt, userPrompt, temperature: 0.7 });
};

// 重新生成單一切角
export const regenerateAngle = async ({ apiKey, model, generated, copyIdx, langName, length = 'medium' }) => {
  const angle = generated.copies[copyIdx];
  const lengthCfg = getLengthConfig(length);
  const { min, max } = getLengthRange(length);

  // 繼承原本紀錄的產業配方/客戶訴求/使用者參考
  let context = '';
  if (generated.userIndustryRef) {
    context += `\n## 客戶提供的產業特性參考\n${generated.userIndustryRef}\n`;
  } else if (generated.industryProfile) {
    context += `\n## 產業配方\n- 鉤子方向:${generated.industryProfile.hookDirection}\n- 痛點:${generated.industryProfile.painPoints.join('、')}\n- 解法:${generated.industryProfile.solutionAngle}\n- CTA:${generated.industryProfile.ctaDirection}\n`;
  }
  if (generated.customBrief) {
    context += `\n## 客戶訴求\n${generated.customBrief}\n`;
  }

  const sysPrompt = `你是頂尖 FB 信息流廣告文案專家。重新為這個切角產出 2 個新變體,字數: ${min}-${max} 字。

${lengthCfg.structure}
${context}
**所有文字用 ${langName},圖片 prompt 用英文,emoji 分段**

回覆 JSON:
{
  "style": "${angle.style}",
  "variants": [
    {
      "label": "A 版",
      "headline": "...", "primary": "(${min}-${max} 字)",
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
語氣:${generated.tone}
目標:${generated.goal}
切角:${angle.style}
語言:${langName}
長度:${lengthCfg.label}

請產出 2 個全新變體,跟舊版不同切入點,符合字數要求。`;

  return await callChatAPI({ apiKey, model, systemPrompt: sysPrompt, userPrompt, temperature: 0.95 });
};

// AI 評分
export const scoreAds = async ({ apiKey, model, generated }) => {
  const allVariants = [];
  generated.copies.forEach((copy, ci) => {
    copy.variants.forEach((v, vi) => {
      allVariants.push({
        id: `${ci}-${vi}`, angle: copy.style, label: v.label,
        headline: v.headline, primary: v.primary
      });
    });
  });

  const sysPrompt = `你是 FB 廣告投放優化師。為每組打分(1-10):
1. hookStrength 2. emotion 3. clarity 4. cta 5. uniqueness
+ overall(總分)、strengths、weaknesses、suggestion。

回覆 JSON:
{
  "scores": [{ "id": "0-0", "hookStrength": 8, "emotion": 7, "clarity": 9, "cta": 6, "uniqueness": 7, "overall": 7.4, "strengths": "...", "weaknesses": "...", "suggestion": "..." }],
  "bestId": "X-Y",
  "summary": "整體分析"
}
只回 JSON。`;

  return await callChatAPI({
    apiKey, model, systemPrompt: sysPrompt,
    userPrompt: `請評分以下 ${allVariants.length} 組:\n\n${JSON.stringify(allVariants, null, 2)}`,
    temperature: 0.3
  });
};

// 影片腳本
export const generateVideoScripts = async ({ apiKey, model, generated, langName }) => {
  const sysPrompt = `你是 Reels/TikTok 短影音腳本專家。用 ${langName} 寫,為每組改寫成 30 秒腳本,含 hook、scenes、cta、musicMood、caption。

回覆 JSON:
{
  "scripts": [{ "angle": "...", "hook": "...", "scenes": [{ "timeRange": "3-8s", "visual": "...", "voiceover": "...", "bRoll": "..." }], "cta": "...", "musicMood": "...", "caption": "..." }]
}
只回 JSON。`;

  const userPrompt = `產業:${generated.industry}\n產品:${generated.productName}\n語氣:${generated.tone}\n語言:${langName}\n\n3 組文案:\n${generated.copies.map((c, i) => `\n--- 第 ${i + 1} 組:${c.style} ---\n${c.variants[0].headline}\n${c.variants[0].primary}`).join('\n')}`;

  return await callChatAPI({ apiKey, model, systemPrompt: sysPrompt, userPrompt, temperature: 0.8 });
};

// DALL-E 出圖
export const generateImage = async ({ apiKey, imageModel, prompt }) => {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: imageModel, prompt, n: 1,
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
