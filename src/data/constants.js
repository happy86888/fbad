// 通行碼
export const ACCESS_CODE = 'ceobrian';

// 語氣
export const TONES = ['專業', '活潑', '溫馨', '幽默', '高端', '熱血'];

// 行銷目標
export const GOALS = ['提升轉換', '品牌曝光', '收集名單', '促銷活動', '新品上市'];

// 多語言
export const LANGUAGES = [
  { id: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
  { id: 'zh-CN', name: '簡體中文', flag: '🇨🇳' },
  { id: 'en', name: 'English', flag: '🇺🇸' },
  { id: 'ja', name: '日本語', flag: '🇯🇵' },
  { id: 'ko', name: '한국어', flag: '🇰🇷' },
  { id: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { id: 'th', name: 'ภาษาไทย', flag: '🇹🇭' },
];

// API Provider 選項
export const API_PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI (付費,品質高)',
    description: '推薦給學員使用,中文文案品質最好',
    keyHint: 'sk-...',
    keyUrl: 'https://platform.openai.com/api-keys',
    color: 'amber'
  },
  {
    id: 'groq',
    name: 'Groq (有免費額度,測試用)',
    description: '適合測試與開發,速度快,可能偶爾有翻譯腔',
    keyHint: 'gsk_...',
    keyUrl: 'https://console.groq.com/keys',
    color: 'pink'
  }
];

// OpenAI 文案模型
export const OPENAI_MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4o mini (便宜快速,推薦)' },
  { id: 'gpt-4o', name: 'GPT-4o (品質最好)' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (最便宜)' },
];

// Groq 文案模型(免費或低價)
export const GROQ_MODELS = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (品質好,推薦)' },
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B (最快速)' },
  { id: 'moonshotai/kimi-k2-instruct', name: 'Kimi K2 (中文較好)' },
  { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 70B (推理強)' },
];

// 圖片模型(只有 OpenAI 提供)
export const IMAGE_MODELS = [
  { id: 'dall-e-3', name: 'DALL-E 3 (品質好,較貴)' },
  { id: 'dall-e-2', name: 'DALL-E 2 (便宜)' },
];

// 切角樣式
export const STYLE_NAMES = [
  '故事開場 · 情境帶入型',
  '痛點剖析 · 自我對話型',
  '見證轉變 · 社會認同型'
];
