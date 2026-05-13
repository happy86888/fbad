// OpenAI / Groq API 呼叫封裝

// 各 provider 的 endpoint
const API_ENDPOINTS = {
  openai: 'https://api.openai.com/v1/chat/completions',
  groq: 'https://api.groq.com/openai/v1/chat/completions'
};

// 判斷 provider:看模型 ID 開頭
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

// 1. 生成廣告文案
export const generateAds = async ({
  apiKey, model, industry, productName, targetAudience, tone, goal,
  language, langName, competitorAnalysis
}) => {
  const competitorContext = competitorAnalysis ? `

## 競品策略參考(我們已分析過競品)
- 他們的策略總結:${competitorAnalysis.summary}
- 他們戳的痛點:${competitorAnalysis.painPoints.join('、')}
- 他們的弱點:${competitorAnalysis.weaknesses.join('、')}
- 我們的差異化:${competitorAnalysis.ourAdvantages.join('、')}
- 建議切角:${competitorAnalysis.recommendedAngles.join('、')}

請參考這份競品分析,讓我們的文案在差異化點上突出,避免與競品同質化。` : '';

  const systemPrompt = `You are a top-tier ad copywriter and cinematic visual director.

**CRITICAL CONTEXT - READ FIRST:**
You are writing ads for a REAL BUSINESS selling REAL PRODUCTS or SERVICES — could be furniture, restaurants, fitness studios, cosmetics, pet supplies, education, fashion, real estate, automotive, anything. You MUST adapt your tone, scenes, pain points, and references to fit the SPECIFIC industry and product.

**FORBIDDEN ANGLES (these are over-used and only work for online courses/info products):**
- DO NOT use "3 years interviewing 500+ experts" framing
- DO NOT use "21 days to see results" framing
- DO NOT use "scattered knowledge / fragmented learning" framing
- DO NOT use "我們訪談了" / "走過彎路" / "把秘訣整理成系統" type language UNLESS the product IS actually a course or info product
- DO NOT default to "knowledge / learning / system" metaphors

Instead, ADAPT to the actual product:
- Furniture → daily living scenes, home atmosphere, material quality, longevity
- Restaurant/Food → sensory details (smell, taste, texture), social moments, comfort
- Fitness → body feeling, mirror moments, energy in daily life, real transformations
- Cosmetics → texture in hand, glance in mirror, compliments from others
- Pet supplies → bonding moments, pet's quality of life, the owner's relief
- Fashion → confidence walking in, getting noticed, fitting like it was made for them
- Real estate → coming home, the view from window, weekend mornings
- Service business → the relief after, customer's actual life change

**ALL output text in ${langName}, except imagePrompt (English only).**

Produce 3 ad angles, each with A/B variants:
1. **故事開場 · 情境帶入型** (Scenario Immersion): Open with a SPECIFIC sensory scene relevant to this product. For furniture: morning coffee, light hitting the table. For food: the first bite. For fitness: zipping up an old pair of jeans.
2. **痛點剖析 · 自我對話型** (Pain Point Inner Dialogue): Speak directly to the unspoken hesitation specific to this product. For furniture buyers: "buying cheap that breaks", "endless comparison fatigue". For food: "every place tastes the same". Avoid generic learning pain points.
3. **見證轉變 · 社會認同型** (Witness Transformation): Real user story showing a CONCRETE life change relevant to THIS product. For furniture: "friends keep asking where she got it". For fitness: "she finally wore that dress". Make the transformation match the product's actual benefit.

A/B variant differences:
- Different structure (linear vs reverse), different hook (question vs statement), different emphasis (process vs result), different image perspective (person vs object)

Copy requirements:
- 250-400 characters in ${langName}
- Write like a real person texting a friend, not like a corporate ad
- Use SPECIFIC scenes — not abstract adjectives
- The numbers/stats you mention should fit the industry (回購率 / 滿意度 / 使用年限 / 用戶數 etc, NOT "21 days to results" unless it's relevant)
- The "social proof" (見證者) should be a buyer/user of THIS product type, not a "學員"
- Ending creates buying desire without hard pitching

Image requirements:
- Cinematic, emotional moments, light as protagonist
- Match the product: furniture → cozy home scenes, food → table moments, fitness → real bodies, etc.
- Avoid: generic stock photo aesthetic, product centered on white background

Reply in JSON format ONLY:
{
  "copies": [
    {
      "style": "(angle name in ${langName})",
      "variants": [
        {
          "label": "(A 版 / Version A / etc. — in ${langName})",
          "headline": "(in ${langName}, 25-40 chars, hook specific to product)",
          "primary": "(in ${langName}, 250-400 chars, narrative + emotion, INDUSTRY-SPECIFIC scenes)",
          "description": "(in ${langName}, max 30 chars)",
          "cta": "(in ${langName})",
          "imagePrompt": "(ENGLISH ONLY - for DALL-E/Midjourney - scene relevant to product)",
          "imageDirection": "(in ${langName})"
        },
        { "label": "...", ... }
      ]
    }
  ]
}`;

  const userPrompt = `Industry: ${industry}
Product/Service: ${productName}
Target Audience: ${targetAudience}
Tone: ${tone}
Marketing Goal: ${goal}
Output Language: ${langName}${competitorContext}

Produce 3 angles, each with A/B variants:
1. Story Opening · Scenario Immersion
2. Pain Point Dissection · Inner Dialogue
3. Witness Transformation · Social Proof

ALL output must be in ${langName}. Only imagePrompt stays in English.`;

  return await callChatAPI({ apiKey, model, systemPrompt, userPrompt, temperature: 0.9 });
};

// 2. 競品分析
export const analyzeCompetitor = async ({ apiKey, model, urls, text, industry, product }) => {
  const sysPrompt = `你是資深廣告策略分析師,擅長從競品的文案與視覺反推他們的行銷策略。

請分析使用者提供的競品資訊,並以 JSON 格式回覆:
{
  "summary": "整體策略總結 (2-3 句)",
  "tone": "他們使用的語氣與調性",
  "targetAudience": "推測的目標受眾",
  "hookStrategy": "他們用什麼鉤子吸引注意",
  "painPoints": ["他們戳的痛點 1", "痛點 2", "痛點 3"],
  "valueProps": ["主打的價值 1", "價值 2", "價值 3"],
  "ctaStrategy": "他們的 CTA 與轉換手法",
  "visualStyle": "視覺風格描述",
  "weaknesses": ["可被攻擊的弱點 1", "弱點 2"],
  "ourAdvantages": ["我們可以強調的差異化 1", "差異化 2", "差異化 3"],
  "recommendedAngles": ["建議我們採用的切角 1", "切角 2", "切角 3"]
}

分析要深入、具體、可執行,不要籠統。只回 JSON。`;

  const userPrompt = `競品連結:
${urls || '(未提供)'}

競品文案內容:
${text || '(未提供)'}

我們的產業:${industry || '(未填)'}
我們的產品:${product || '(未填)'}

請分析他們的策略,並建議我們可以怎麼差異化。`;

  return await callChatAPI({ apiKey, model, systemPrompt: sysPrompt, userPrompt, temperature: 0.7 });
};

// 3. 重新生成單一切角
export const regenerateAngle = async ({ apiKey, model, generated, copyIdx, langName }) => {
  const angle = generated.copies[copyIdx];

  const sysPrompt = `You are a top-tier ad copywriter. Regenerate this specific angle with NEW creative variations.

**ALL text output in ${langName}, except imagePrompt (English only).**

Reply in JSON:
{
  "style": "${angle.style}",
  "variants": [
    {
      "label": "(A 版 / Version A in ${langName})",
      "headline": "...", "primary": "...", "description": "...", "cta": "...",
      "imagePrompt": "ENGLISH only", "imageDirection": "in ${langName}"
    },
    { "label": "B 版 / Version B", ... }
  ]
}

Make it DIFFERENT from this previous version (give us fresh angles):
${JSON.stringify(angle.variants.map(v => ({ headline: v.headline, primary: v.primary.slice(0, 100) })))}

Copy requirements: tell a real story, 250-400 chars, emotional, narrative.
Image requirements: cinematic, not stock photo, emotional moment.`;

  const userPrompt = `Industry: ${generated.industry}
Product: ${generated.productName}
Target: ${generated.targetAudience}
Tone: ${generated.tone}
Goal: ${generated.goal}
Angle: ${angle.style}
Language: ${langName}

Generate 2 NEW variants for this angle, distinct from previous.`;

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

請為每組文案打分(1-10),評估以下五個維度:
1. **hookStrength** (鉤子強度):開頭 3 秒能不能讓人停下來
2. **emotion** (情感濃度):有沒有真實情感、能不能引起共鳴
3. **clarity** (訊息清晰):讀者能不能 5 秒內理解你在賣什麼
4. **cta** (CTA 力道):結尾有沒有讓人「現在就要行動」的衝動
5. **uniqueness** (差異化):跟市面上 99% 的廣告有沒有不一樣

並給出:
- **overall**: 加權總分 (滿分 10)
- **strengths**: 優點 (1-2 句)
- **weaknesses**: 弱點 (1-2 句)
- **suggestion**: 一個具體可改進的建議

回覆格式:
{
  "scores": [
    {
      "id": "0-0", "hookStrength": 8, "emotion": 7, "clarity": 9, "cta": 6, "uniqueness": 7, "overall": 7.4,
      "strengths": "...", "weaknesses": "...", "suggestion": "..."
    }
  ],
  "bestId": "X-Y",
  "summary": "整體分析與建議 (2-3 句)"
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
  const sysPrompt = `你是 IG Reels / TikTok / YouTube Shorts 短影音腳本專家,精通 30 秒病毒影片的節奏設計。

**請用 ${langName} 撰寫所有內容。**

根據用戶提供的 3 組 FB 廣告文案,為每組改寫成一份 30 秒影片腳本。

每份腳本要包含:
- **hook** (0-3 秒):開場鉤子,要在 3 秒內抓住眼球
- **scenes**: 分鏡 (3-5 個),每鏡頭包含 timeRange, visual, voiceover, bRoll
- **cta** (最後 3 秒):行動呼籲
- **musicMood**: 配樂氛圍建議
- **caption**: 影片發布時的貼文文字

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

以下是 3 組 FB 廣告文案,請為每組改寫成 30 秒短影音腳本:

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
