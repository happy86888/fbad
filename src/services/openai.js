// OpenAI API 呼叫封裝

const callChatAPI = async ({ apiKey, model, systemPrompt, userPrompt, temperature = 0.8 }) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `API 錯誤 (${response.status})`);
  }

  const data = await response.json();
  return {
    parsed: JSON.parse(data.choices[0].message.content),
    usage: data.usage
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

**IMPORTANT: ALL output text (including style names, labels, copy, descriptions, CTA, image directions) MUST be written in ${langName}.**
The "imagePrompt" field is the ONLY exception — it must be in English (since DALL-E/Midjourney work better with English prompts).

Produce 3 ad angles, each with A/B variants for A/B testing.

A/B variant differences:
- Different structure, different hook angle, different emphasis, different image perspective.

Copy requirements:
- Don't write generic ad copy. Tell a real story like talking to a friend.
- Open with emotion, jump straight into a scene
- Use specific scenes instead of abstract adjectives
- Mid-section paints "small detail changes after use"
- Ending creates buying urgency without hard selling
- 250-400 characters/words, use line breaks for rhythm

Image requirements:
- NOT studio product shots — cinematic, dramatic
- "Emotional moments", light as protagonist, asymmetric composition
- Avoid: direct smile to camera, product in center, clean white backgrounds

Reply in JSON format ONLY:
{
  "copies": [
    {
      "style": "(angle name in ${langName})",
      "variants": [
        {
          "label": "(A 版 / Version A / etc. — in ${langName})",
          "headline": "(in ${langName}, 25-40 chars)",
          "primary": "(in ${langName}, 250-400 chars, narrative + emotion)",
          "description": "(in ${langName}, max 30 chars)",
          "cta": "(in ${langName})",
          "imagePrompt": "(ENGLISH ONLY - for DALL-E/Midjourney)",
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
