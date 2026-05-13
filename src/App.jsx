import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';

import { LANGUAGES, OPENAI_MODELS, GROQ_MODELS } from './data/constants';
import { generateGPTPrompt } from './templates';
import {
  generateAds, analyzeCompetitor, regenerateAngle,
  scoreAds, generateVideoScripts, generateImage,
  analyzeIndustry
} from './services/openai';
import { useLocalStorage } from './hooks/useLocalStorage';
import { safeLocalStorage, injectNoIndex } from './utils/helpers';
import { exportPDF, exportExcel } from './utils/export';

import PasswordGate from './components/PasswordGate';
import Header from './components/Header';
import ApiSettings from './components/ApiSettings';
import CompetitorAnalysis from './components/CompetitorAnalysis';
import ConditionForm from './components/ConditionForm';
import ResultsSection from './components/ResultsSection';
import HistoryDrawer from './components/HistoryDrawer';
import TemplatesDrawer from './components/TemplatesDrawer';
import BrandManager from './components/BrandManager';
import BatchModal from './components/BatchModal';
import FBPreview from './components/FBPreview';
import IndustryReview from './components/IndustryReview';

// 從網址讀 provider:?groq → Groq 測試模式,否則預設 OpenAI
const detectProvider = () => {
  if (typeof window === 'undefined') return 'openai';
  const params = new URLSearchParams(window.location.search);
  // 支援 ?groq 或 ?groq=1 或 ?mode=groq
  if (params.has('groq') || params.get('mode') === 'groq') {
    return 'groq';
  }
  return 'openai';
};

export default function App() {
  // 通行碼
  const [isUnlocked, setIsUnlocked] = useState(() => safeLocalStorage.get('adbot_unlocked') === 'true');

  // Provider 從網址判斷(每次重新整理都會重新判斷,不存 localStorage)
  const [provider] = useState(() => detectProvider());
  const isGroqMode = provider === 'groq';

  // 表單條件
  const [industry, setIndustry] = useState('');
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('專業');
  const [customTone, setCustomTone] = useState('');
  const [goal, setGoal] = useState('提升轉換');
  const [customGoal, setCustomGoal] = useState('');
  const [customBrief, setCustomBrief] = useLocalStorage('adbot_brief', '');
  const [userIndustryRef, setUserIndustryRef] = useLocalStorage('adbot_industry_ref', '');
  const [length, setLength] = useLocalStorage('adbot_length', 'medium');
  const [genMode, setGenMode] = useLocalStorage('adbot_gen_mode', 'smart'); // fast | smart | precise

  // 產業審核彈窗
  const [showIndustryReview, setShowIndustryReview] = useState(false);
  const [pendingProfile, setPendingProfile] = useState(null);

  // API 設定 (Key 和 model 依 provider 分開存)
  const keyStorageName = isGroqMode ? 'adbot_groq_key' : 'adbot_api_key';
  const modelStorageName = isGroqMode ? 'adbot_groq_model' : 'adbot_openai_model';
  const defaultModel = isGroqMode ? GROQ_MODELS[0].id : OPENAI_MODELS[0].id;

  const [apiKey, setApiKey] = useLocalStorage(keyStorageName, '');
  const [language, setLanguage] = useLocalStorage('adbot_language', 'zh-TW');
  const [model, setModel] = useLocalStorage(modelStorageName, defaultModel);
  const [imageModel, setImageModel] = useState('dall-e-3');
  const [useAPI, setUseAPI] = useState(true);  // 預設開啟,但保留開關
  const [enableImageGen, setEnableImageGen] = useState(false);

  // 狀態
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const [copiedItem, setCopiedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('copy');
  const [error, setError] = useState('');
  const [activeVariant, setActiveVariant] = useState({});

  // 持久資料
  const [history, setHistory] = useLocalStorage('adbot_history', [], true);
  const [templates, setTemplates] = useLocalStorage('adbot_templates', [], true);
  const [favorites, setFavorites] = useLocalStorage('adbot_favorites', {}, true);
  const [brands, setBrands] = useLocalStorage('adbot_brands', [], true);
  const [currentBrand, setCurrentBrand] = useLocalStorage('adbot_current_brand', 'default');
  const [aiScores, setAIScores] = useLocalStorage('adbot_scores', {}, true);
  const [videoScripts, setVideoScripts] = useLocalStorage('adbot_videos', {}, true);

  // 競品
  const [showCompetitor, setShowCompetitor] = useState(false);
  const [competitorUrls, setCompetitorUrls] = useState('');
  const [competitorText, setCompetitorText] = useState('');
  const [competitorAnalyzing, setCompetitorAnalyzing] = useState(false);
  const [competitorAnalysis, setCompetitorAnalysis] = useState(null);

  // UI 開關
  const [showHistory, setShowHistory] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showBrandManager, setShowBrandManager] = useState(false);
  const [showBatch, setShowBatch] = useState(false);

  // 編輯
  const [editingVariant, setEditingVariant] = useState(null);
  const [editBuffer, setEditBuffer] = useState({});

  // 重生 / 評分 / 影片 / 預覽
  const [regenerating, setRegenerating] = useState({});
  const [scoring, setScoring] = useState(false);
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [previewMode, setPreviewMode] = useState(null);

  // 批次
  const [batchProducts, setBatchProducts] = useState('');
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

  const [exporting, setExporting] = useState(false);

  // 注入 SEO 屏蔽
  useEffect(() => {
    return injectNoIndex();
  }, []);

  // Groq 模式時自動關掉出圖(Groq 不支援)
  useEffect(() => {
    if (isGroqMode && enableImageGen) {
      setEnableImageGen(false);
    }
  }, [isGroqMode]);

  // 過濾後的歷史 (依品牌)
  const filteredHistory = currentBrand === 'default'
    ? history
    : history.filter(h => h.brand === currentBrand);

  // ============ 通行碼 ============
  const handleLogout = () => {
    if (confirm('確定要登出?下次需要重新輸入通行碼')) {
      setIsUnlocked(false);
      safeLocalStorage.remove('adbot_unlocked');
    }
  };

  // ============ 工具 ============
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const saveToHistory = (record) => {
    const newHistory = [record, ...history].slice(0, 30);
    setHistory(newHistory);
  };

  const updateGenerated = (updated) => {
    setGenerated(updated);
    const newHistory = history.map(h => h.id === generated.id ? updated : h);
    setHistory(newHistory);
  };

  const loadFromHistory = (record) => {
    setGenerated(record);
    setIndustry(record.industry);
    setProduct(record.productName !== `${record.industry}相關產品/服務` ? record.productName : '');
    setAudience(record.targetAudience !== `${record.industry}潛在客戶` ? record.targetAudience : '');
    setTone(record.tone);
    setGoal(record.goal);
    if (record.language) setLanguage(record.language);
    if (record.length) setLength(record.length);
    setActiveVariant({});
    setShowHistory(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteFromHistory = (id) => {
    setHistory(history.filter(h => h.id !== id));
  };

  const clearAllHistory = () => {
    if (confirm('確定清空所有歷史紀錄?')) {
      setHistory([]);
    }
  };

  // ============ 範本 ============
  const saveTemplate = (name) => {
    const newTpl = {
      id: Date.now(), name,
      industry, product, audience, tone, goal, language, length,
      timestamp: new Date().toISOString()
    };
    setTemplates([newTpl, ...templates].slice(0, 50));
  };

  const applyTemplate = (tpl) => {
    setIndustry(tpl.industry || '');
    setProduct(tpl.product || '');
    setAudience(tpl.audience || '');
    setTone(tpl.tone || '專業');
    setGoal(tpl.goal || '提升轉換');
    if (tpl.language) setLanguage(tpl.language);
    if (tpl.length) setLength(tpl.length);
    setShowTemplates(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteTemplate = (id) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  // ============ 最愛 ============
  const toggleFavorite = (copyIdx, variantIdx) => {
    if (!generated) return;
    const recId = generated.id;
    const current = favorites[recId] || [];
    const key = `${copyIdx}-${variantIdx}`;
    const exists = current.some(f => `${f.copyIdx}-${f.variantIdx}` === key);
    const updated = exists
      ? current.filter(f => `${f.copyIdx}-${f.variantIdx}` !== key)
      : [...current, { copyIdx, variantIdx }];
    setFavorites({ ...favorites, [recId]: updated });
  };

  const isFavorite = (copyIdx, variantIdx) => {
    if (!generated) return false;
    const current = favorites[generated.id] || [];
    return current.some(f => f.copyIdx === copyIdx && f.variantIdx === variantIdx);
  };

  // ============ 編輯 ============
  const startEdit = (copyIdx, variantIdx) => {
    const v = generated.copies[copyIdx].variants[variantIdx];
    setEditBuffer({
      headline: v.headline, primary: v.primary,
      description: v.description, cta: v.cta
    });
    setEditingVariant({ copyIdx, variantIdx });
  };

  const saveEdit = () => {
    if (!editingVariant) return;
    const newCopies = [...generated.copies];
    const v = newCopies[editingVariant.copyIdx].variants[editingVariant.variantIdx];
    Object.assign(v, editBuffer, { edited: true });
    updateGenerated({ ...generated, copies: newCopies });
    setEditingVariant(null);
    setEditBuffer({});
  };

  const cancelEdit = () => {
    setEditingVariant(null);
    setEditBuffer({});
  };

  // ============ 品牌 ============
  const addBrand = (name) => {
    setBrands([...brands, { id: Date.now().toString(), name }]);
  };

  const switchBrand = (brandId) => {
    setCurrentBrand(brandId);
  };

  const deleteBrand = (brandId) => {
    if (!confirm('確定刪除這個品牌資料夾?(歷史紀錄不會被刪除,只會回到「全部」)')) return;
    setBrands(brands.filter(b => b.id !== brandId));
    if (currentBrand === brandId) setCurrentBrand('default');
  };

  // ============ 主生成邏輯(三種模式) ============
  const handleGenerate = async () => {
    if (!industry.trim()) {
      setError('請先輸入產業類別');
      return;
    }
    if (!useAPI) {
      setError('請開啟 API 開關才能生成廣告');
      return;
    }
    if (!apiKey.trim()) {
      setError(isGroqMode
        ? '請輸入 Groq API Key (到 https://console.groq.com/keys 免費取得)'
        : '請輸入 OpenAI API Key (到 https://platform.openai.com/api-keys 取得)');
      return;
    }

    setError('');
    setActiveVariant({});

    const langName = LANGUAGES.find(l => l.id === language)?.name || '繁體中文';
    const hasUserRef = userIndustryRef && userIndustryRef.trim();

    // 快速模式 OR 使用者已填產業參考 → 直接生成
    if (genMode === 'fast' || hasUserRef) {
      await doGenerate(null);
      return;
    }

    // 智能模式或精準模式 → 先分析產業
    setLoading(true);
    try {
      const { parsed: profile } = await analyzeIndustry({
        apiKey, model, industry, productName: product, targetAudience: audience, langName
      });

      if (genMode === 'smart') {
        // 智能模式:分析完直接寫
        await doGenerate(profile);
      } else if (genMode === 'precise') {
        // 精準模式:顯示審核彈窗
        setPendingProfile(profile);
        setShowIndustryReview(true);
        setLoading(false);
      }
    } catch (err) {
      setError(`產業分析失敗:${err.message}`);
      setLoading(false);
    }
  };

  // 真正執行廣告生成
  const doGenerate = async (industryProfile) => {
    setLoading(true);
    setError('');

    const productName = product || `${industry}相關產品/服務`;
    const targetAudience = audience || `${industry}潛在客戶`;
    const langName = LANGUAGES.find(l => l.id === language)?.name || '繁體中文';

    try {
      const { parsed, usage } = await generateAds({
        apiKey, model, industry, productName, targetAudience,
        tone, goal, language, langName, competitorAnalysis,
        length,
        customTone, customGoal, customBrief,
        industryProfile,
        userIndustryRef
      });

      const processedCopies = parsed.copies.map(copy => ({
        ...copy,
        variants: copy.variants.map(v => ({ ...v, generatedImage: null }))
      }));

      const record = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        copies: processedCopies,
        gptPrompt: generateGPTPrompt(industry, productName, targetAudience, tone, goal, language, LANGUAGES),
        industry, productName, targetAudience, tone, goal, language,
        source: 'api', provider, model, usage, length,
        customTone, customGoal, customBrief,
        userIndustryRef, industryProfile, genMode,
        competitorAnalysis,
        brand: currentBrand
      };
      setGenerated(record);
      saveToHistory(record);
    } catch (err) {
      setError(`API 呼叫失敗:${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 精準模式:確認產業分析後產文案
  const handleConfirmProfile = async (editedProfile) => {
    setShowIndustryReview(false);
    setPendingProfile(null);
    await doGenerate(editedProfile);
  };

  // ============ 競品分析 ============
  const handleAnalyzeCompetitor = async () => {
    if (!apiKey.trim()) {
      setError('競品分析需要 API Key');
      return;
    }
    if (!competitorUrls.trim() && !competitorText.trim()) {
      setError('請貼上競品連結或文案');
      return;
    }

    setCompetitorAnalyzing(true);
    setError('');

    try {
      const { parsed } = await analyzeCompetitor({
        apiKey, model,
        urls: competitorUrls, text: competitorText,
        industry, product
      });
      setCompetitorAnalysis(parsed);
    } catch (err) {
      setError(`競品分析失敗:${err.message}`);
    } finally {
      setCompetitorAnalyzing(false);
    }
  };

  // ============ 重新生成單一切角 ============
  const handleRegenerateAngle = async (copyIdx) => {
    if (!apiKey.trim()) {
      setError('重新生成需要 API Key');
      return;
    }
    const regenKey = `angle-${copyIdx}`;
    setRegenerating({ ...regenerating, [regenKey]: true });
    setError('');

    const langName = LANGUAGES.find(l => l.id === (generated.language || 'zh-TW'))?.name || '繁體中文';

    try {
      const { parsed } = await regenerateAngle({ apiKey, model, generated, copyIdx, langName, length: generated.length || length });
      const newCopies = [...generated.copies];
      newCopies[copyIdx] = {
        ...parsed,
        variants: parsed.variants.map(v => ({ ...v, generatedImage: null }))
      };
      updateGenerated({ ...generated, copies: newCopies });
    } catch (err) {
      setError(`重新生成失敗:${err.message}`);
    } finally {
      setRegenerating({ ...regenerating, [regenKey]: false });
    }
  };

  // ============ DALL-E 出圖 ============
  const handleGenerateImage = async (copyIdx, variantIdx) => {
    if (isGroqMode) {
      setError('Groq 不支援圖片生成');
      return;
    }
    if (!apiKey.trim()) {
      setError('請先輸入 OpenAI API Key 才能出圖');
      return;
    }
    const variant = generated.copies[copyIdx].variants[variantIdx];
    const imgKey = `${copyIdx}-${variantIdx}`;
    setImageLoading({ ...imageLoading, [imgKey]: true });
    setError('');

    try {
      const imageUrl = await generateImage({ apiKey, imageModel, prompt: variant.imagePrompt });
      const newCopies = [...generated.copies];
      newCopies[copyIdx].variants[variantIdx].generatedImage = imageUrl;
      updateGenerated({ ...generated, copies: newCopies });
    } catch (err) {
      setError(`出圖失敗:${err.message}`);
    } finally {
      setImageLoading({ ...imageLoading, [imgKey]: false });
    }
  };

  // ============ AI 評分 ============
  const handleScoreAds = async () => {
    if (!apiKey.trim()) { setError('AI 評分需要 API Key'); return; }
    if (!generated) return;
    setScoring(true);
    setError('');

    try {
      const { parsed } = await scoreAds({ apiKey, model, generated });
      setAIScores({ ...aiScores, [generated.id]: parsed });
    } catch (err) {
      setError(`評分失敗:${err.message}`);
    } finally {
      setScoring(false);
    }
  };

  // ============ 影片腳本 ============
  const handleGenerateVideo = async () => {
    if (!apiKey.trim()) { setError('影片腳本需要 API Key'); return; }
    if (!generated) return;
    setGeneratingVideo(true);
    setError('');

    const langName = LANGUAGES.find(l => l.id === (generated.language || 'zh-TW'))?.name || '繁體中文';

    try {
      const { parsed } = await generateVideoScripts({ apiKey, model, generated, langName });
      setVideoScripts({ ...videoScripts, [generated.id]: parsed });
    } catch (err) {
      setError(`影片腳本生成失敗:${err.message}`);
    } finally {
      setGeneratingVideo(false);
    }
  };

  // ============ 批次生成 ============
  const handleBatchRun = async () => {
    if (!apiKey.trim()) { setError('批次生成需要 API Key'); return; }
    const productList = batchProducts.split('\n').map(p => p.trim()).filter(p => p);
    if (productList.length === 0) { setError('請輸入至少一個產品名稱'); return; }
    if (!industry.trim()) { setError('請先填寫產業類別 (批次共用)'); return; }

    setBatchRunning(true);
    setBatchProgress({ current: 0, total: productList.length });
    setError('');

    const originalProduct = product;
    const langName = LANGUAGES.find(l => l.id === language)?.name || '繁體中文';
    const targetAudience = audience || `${industry}潛在客戶`;

    for (let i = 0; i < productList.length; i++) {
      setBatchProgress({ current: i + 1, total: productList.length });
      const productName = productList[i];
      try {
        const { parsed, usage } = await generateAds({
          apiKey, model, industry, productName, targetAudience,
          tone, goal, language, langName, competitorAnalysis,
          length,
          customTone, customGoal, customBrief,
          userIndustryRef
        });
        const processedCopies = parsed.copies.map(copy => ({
          ...copy,
          variants: copy.variants.map(v => ({ ...v, generatedImage: null }))
        }));
        const record = {
          id: Date.now() + Math.random(),
          timestamp: new Date().toISOString(),
          copies: processedCopies,
          gptPrompt: generateGPTPrompt(industry, productName, targetAudience, tone, goal, language, LANGUAGES),
          industry, productName, targetAudience, tone, goal, language,
          source: 'api', provider, model, usage, brand: currentBrand,
          length
        };
        saveToHistory(record);
        await new Promise(r => setTimeout(r, 500));
      } catch (e) {
        console.error('批次第', i + 1, '次失敗:', e);
      }
    }

    setProduct(originalProduct);
    setBatchRunning(false);
    setShowBatch(false);
    alert(`批次生成完成!共產出 ${productList.length} 組廣告,請至「歷史紀錄」查看`);
  };

  // ============ 匯出 ============
  const handleExportPDF = () => {
    setExporting(true);
    exportPDF(generated, LANGUAGES);
    setExporting(false);
  };

  // ============ Render ============
  if (!isUnlocked) {
    return <PasswordGate onUnlock={() => setIsUnlocked(true)} />;
  }

  const cardProps = {
    setActiveVariant, activeVariant,
    isFavorite, toggleFavorite,
    setPreviewMode,
    regenerating, onRegenerate: handleRegenerateAngle,
    useAPI,
    enableImageGen,
    imageLoading, onGenerateImage: handleGenerateImage,
    editingVariant, editBuffer, setEditBuffer,
    onStartEdit: startEdit, onSaveEdit: saveEdit, onCancelEdit: cancelEdit
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Header
        language={language} setLanguage={setLanguage}
        useAPI={useAPI}
        historyCount={history.length}
        templatesCount={templates.length}
        currentBrand={currentBrand} brands={brands}
        onShowHistory={() => setShowHistory(true)}
        onShowTemplates={() => setShowTemplates(true)}
        onShowBrandManager={() => setShowBrandManager(true)}
        onLogout={handleLogout}
      />

      <HistoryDrawer
        show={showHistory} onClose={() => setShowHistory(false)}
        history={history} filteredHistory={filteredHistory}
        currentBrand={currentBrand} brands={brands} switchBrand={switchBrand}
        favorites={favorites} aiScores={aiScores}
        onLoad={loadFromHistory} onDelete={deleteFromHistory} onClearAll={clearAllHistory}
      />

      <TemplatesDrawer
        show={showTemplates} onClose={() => setShowTemplates(false)}
        templates={templates} industry={industry}
        onSaveTemplate={saveTemplate}
        onApplyTemplate={applyTemplate}
        onDeleteTemplate={deleteTemplate}
      />

      <BrandManager
        show={showBrandManager} onClose={() => setShowBrandManager(false)}
        brands={brands} currentBrand={currentBrand} history={history}
        switchBrand={switchBrand} onAddBrand={addBrand} onDeleteBrand={deleteBrand}
      />

      <BatchModal
        show={showBatch} onClose={() => setShowBatch(false)}
        batchProducts={batchProducts} setBatchProducts={setBatchProducts}
        batchRunning={batchRunning} batchProgress={batchProgress}
        apiKey={apiKey} useAPI={useAPI} onRun={handleBatchRun}
      />

      <FBPreview previewMode={previewMode} generated={generated} onClose={() => setPreviewMode(null)} />

      <IndustryReview
        show={showIndustryReview}
        profile={pendingProfile}
        onClose={() => { setShowIndustryReview(false); setPendingProfile(null); }}
        onConfirm={handleConfirmProfile}
      />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="inline-block px-3 py-1 border border-zinc-700 rounded-full font-mono text-xs text-zinc-400 mb-4">
            // v5.1 · AI 廣告生成器
            {isGroqMode && <span className="ml-2 text-pink-400">[GROQ TEST MODE]</span>}
          </div>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95] mb-6">
            讓滑到的人<br />
            <span className="gradient-text">停下來</span> 讀完<br />
            <span className="gradient-text">然後下單</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl text-lg leading-relaxed">
            文案像在說故事,有溫度、有畫面、有「現在就要下單」的渴望。圖片不再是商品照,而是有情緒、有光線、有電影感的瞬間。
          </p>
        </div>

        <ApiSettings
          provider={provider}
          apiKey={apiKey} setApiKey={setApiKey}
          model={model} setModel={setModel}
          imageModel={imageModel} setImageModel={setImageModel}
          useAPI={useAPI} setUseAPI={setUseAPI}
          enableImageGen={enableImageGen} setEnableImageGen={setEnableImageGen}
          groqMode={isGroqMode}
        />

        <CompetitorAnalysis
          show={showCompetitor} setShow={setShowCompetitor}
          competitorUrls={competitorUrls} setCompetitorUrls={setCompetitorUrls}
          competitorText={competitorText} setCompetitorText={setCompetitorText}
          competitorAnalyzing={competitorAnalyzing}
          competitorAnalysis={competitorAnalysis} setCompetitorAnalysis={setCompetitorAnalysis}
          apiKey={apiKey} onAnalyze={handleAnalyzeCompetitor}
        />

        <ConditionForm
          industry={industry} setIndustry={setIndustry}
          product={product} setProduct={setProduct}
          audience={audience} setAudience={setAudience}
          tone={tone} setTone={setTone}
          customTone={customTone} setCustomTone={setCustomTone}
          goal={goal} setGoal={setGoal}
          customGoal={customGoal} setCustomGoal={setCustomGoal}
          customBrief={customBrief} setCustomBrief={setCustomBrief}
          userIndustryRef={userIndustryRef} setUserIndustryRef={setUserIndustryRef}
          length={length} setLength={setLength}
          genMode={genMode} setGenMode={setGenMode}
          loading={loading} useAPI={useAPI} error={error}
          hasCompetitor={!!competitorAnalysis}
          onGenerate={handleGenerate} onShowBatch={() => setShowBatch(true)}
        />

        {generated ? (
          <ResultsSection
            generated={generated}
            activeTab={activeTab} setActiveTab={setActiveTab}
            aiScores={aiScores} scoring={scoring} onScoreAds={handleScoreAds}
            videoScripts={videoScripts} generatingVideo={generatingVideo} onGenerateVideo={handleGenerateVideo}
            apiKey={apiKey} exporting={exporting}
            onExportPDF={handleExportPDF} onExportExcel={() => exportExcel(generated)}
            copiedItem={copiedItem} copyToClipboard={copyToClipboard}
            cardProps={cardProps}
          />
        ) : (!loading && (
          <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl">
            <Flame className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-600 font-mono text-sm">// 等待輸入產業類別,寫一個讓人停下來的故事...</p>
          </div>
        ))}
      </main>

      <footer className="border-t border-zinc-800 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-600">
          <span>© 老闆接案學院 AD/BOT v5.4</span>
          <div className="flex items-center gap-3">
            <a href="https://lin.ee/6PuIdSx" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#06C755] hover:bg-[#05a647] text-white rounded-full transition no-underline">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              聯絡 LINE
            </a>
            <span className="hidden sm:inline">API Key 與紀錄僅存於瀏覽器 localStorage</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
