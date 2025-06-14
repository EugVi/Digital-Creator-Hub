import { useLanguage } from "@/hooks/use-language";
import { ProductIdea, IdeaValidation, PromotionKit } from "@shared/schema";
import { Lightbulb, CheckCircle, Megaphone, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ResultsDisplayProps {
  ideas?: ProductIdea[];
  validation?: IdeaValidation;
  promotionKit?: PromotionKit;
}

export default function ResultsDisplay({ ideas, validation, promotionKit }: ResultsDisplayProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      toast({
        title: t('button.copied'),
        duration: 2000,
      });
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  if (!ideas && !validation && !promotionKit) {
    return null;
  }

  return (
    <div id="results-container" className="space-y-6">
      {/* Product Ideas Results */}
      {ideas && ideas.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              <Lightbulb className="inline text-blue-600 mr-2" size={20} />
              {t('results.generateIdea.title')}
            </h3>
            <button
              onClick={() => copyToClipboard(JSON.stringify(ideas, null, 2), 'ideas')}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              title={t('button.copyToClipboard')}
            >
              {copiedStates['ideas'] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="space-y-4">
            {ideas.map((idea, index) => (
              <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                <h4 className="font-semibold text-slate-900 mb-2">{idea.title}</h4>
                <p className="text-slate-700 mb-3">{idea.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {idea.category}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {idea.priceRange}
                  </span>
                  {idea.tags?.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-2 p-2 bg-slate-50 rounded text-sm text-slate-600">
                  <strong>Target Audience:</strong> {idea.targetAudience}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation Results */}
      {validation && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              <CheckCircle className="inline text-emerald-600 mr-2" size={20} />
              {t('results.validateIdea.title')}
            </h3>
            <button
              onClick={() => copyToClipboard(JSON.stringify(validation, null, 2), 'validation')}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              title={t('button.copyToClipboard')}
            >
              {copiedStates['validation'] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {validation.marketPotential}/10
              </div>
              <div className="text-sm text-emerald-700">{t('validation.marketPotential')}</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600 mb-1">
                {validation.competitionLevel}/10
              </div>
              <div className="text-sm text-amber-700">{t('validation.competitionLevel')}</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {validation.feasibilityScore}/10
              </div>
              <div className="text-sm text-blue-700">{t('validation.feasibilityScore')}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">✅ {t('validation.strengths')}</h4>
              <ul className="text-slate-700 text-sm space-y-1 ml-4">
                {validation.strengths.map((strength, index) => (
                  <li key={index}>• {strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">⚠️ {t('validation.challenges')}</h4>
              <ul className="text-slate-700 text-sm space-y-1 ml-4">
                {validation.challenges.map((challenge, index) => (
                  <li key={index}>• {challenge}</li>
                ))}
              </ul>
            </div>
            {validation.recommendation && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>Recommendation:</strong> {validation.recommendation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Promotion Kit Results */}
      {promotionKit && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              <Megaphone className="inline text-violet-600 mr-2" size={20} />
              {t('results.generateKit.title')}
            </h3>
            <button
              onClick={() => copyToClipboard(JSON.stringify(promotionKit, null, 2), 'promotionKit')}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              title={t('button.copyToClipboard')}
            >
              {copiedStates['promotionKit'] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-900 mb-3">📧 {t('promotion.emailCampaign')}</h4>
              <div className="bg-slate-50 p-4 rounded-lg text-sm">
                <p className="font-medium mb-2">Subject: {promotionKit.emailCampaign.subject}</p>
                <p className="text-slate-700">{promotionKit.emailCampaign.content}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-3">📱 {t('promotion.socialMediaPosts')}</h4>
              <div className="space-y-2">
                {promotionKit.socialMediaPosts.map((post, index) => (
                  <div key={index} className="bg-slate-50 p-4 rounded-lg text-sm">
                    <p className="text-slate-700">{post}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-slate-900 mb-3">🎯 {t('promotion.affiliateResources')}</h4>
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <strong>{t('promotion.commissionRate')}:</strong> {promotionKit.affiliateResources.commissionRate}
                </div>
                <div>
                  <strong>{t('promotion.cookieDuration')}:</strong> {promotionKit.affiliateResources.cookieDuration}
                </div>
                <div>
                  <strong>{t('promotion.averageOrderValue')}:</strong> {promotionKit.affiliateResources.averageOrderValue}
                </div>
              </div>
              {promotionKit.affiliateResources.salesCopy && (
                <div className="text-sm text-slate-700">
                  <strong>Sales Copy:</strong> {promotionKit.affiliateResources.salesCopy}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
