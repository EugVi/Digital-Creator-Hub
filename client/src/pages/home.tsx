import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ProductIdea, IdeaValidation, PromotionKit } from "@shared/schema";
import { GenerateIdeasResponse, ValidateIdeaResponse, GeneratePromotionKitResponse } from "@/types/api";
import LanguageSwitcher from "@/components/language-switcher";
import NicheInput from "@/components/niche-input";
import ActionCards from "@/components/action-cards";
import ResultsDisplay from "@/components/results-display";
import { Rocket } from "lucide-react";

export default function Home() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [niche, setNiche] = useState("");
  const [currentIdea, setCurrentIdea] = useState("");
  const [results, setResults] = useState<{
    ideas?: ProductIdea[];
    validation?: IdeaValidation;
    promotionKit?: PromotionKit;
  }>({});

  // Generate Ideas Mutation
  const generateIdeasMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/generate-ideas", {
        niche,
        language,
      });
      return response.json() as Promise<GenerateIdeasResponse>;
    },
    onSuccess: (data) => {
      if (data.success) {
        setResults(prev => ({ ...prev, ideas: data.ideas }));
        if (data.ideas.length > 0) {
          setCurrentIdea(data.ideas[0].title);
        }
        toast({
          title: t('status.success'),
          description: `Generated ${data.ideas.length} product ideas`,
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to generate ideas",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate ideas",
        variant: "destructive",
      });
    },
  });

  // Validate Idea Mutation
  const validateIdeaMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/validate-idea", {
        idea: currentIdea,
        niche,
        language,
      });
      return response.json() as Promise<ValidateIdeaResponse>;
    },
    onSuccess: (data) => {
      if (data.success) {
        setResults(prev => ({ ...prev, validation: data.validation }));
        toast({
          title: t('status.success'),
          description: "Idea validation completed",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to validate idea",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to validate idea",
        variant: "destructive",
      });
    },
  });

  // Generate Promotion Kit Mutation
  const generatePromotionKitMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/generate-promotion-kit", {
        idea: currentIdea,
        niche,
        language,
      });
      return response.json() as Promise<GeneratePromotionKitResponse>;
    },
    onSuccess: (data) => {
      if (data.success) {
        setResults(prev => ({ ...prev, promotionKit: data.promotionKit }));
        toast({
          title: t('status.success'),
          description: "Promotion kit generated",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to generate promotion kit",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate promotion kit",
        variant: "destructive",
      });
    },
  });

  const handleGenerateIdea = () => {
    if (!niche.trim()) {
      toast({
        title: "Error",
        description: t('error.nicheRequired'),
        variant: "destructive",
      });
      return;
    }
    generateIdeasMutation.mutate();
  };

  const handleValidateIdea = () => {
    if (!niche.trim()) {
      toast({
        title: "Error",
        description: t('error.nicheRequired'),
        variant: "destructive",
      });
      return;
    }
    if (!currentIdea.trim()) {
      toast({
        title: "Error",
        description: t('error.ideaRequired'),
        variant: "destructive",
      });
      return;
    }
    validateIdeaMutation.mutate();
  };

  const handleGenerateKit = () => {
    if (!niche.trim()) {
      toast({
        title: "Error",
        description: t('error.nicheRequired'),
        variant: "destructive",
      });
      return;
    }
    if (!currentIdea.trim()) {
      toast({
        title: "Error",
        description: t('error.ideaRequired'),
        variant: "destructive",
      });
      return;
    }
    generatePromotionKitMutation.mutate();
  };

  const handleClearNiche = () => {
    setNiche("");
    setCurrentIdea("");
    setResults({});
  };

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                <Rocket className="text-white" size={20} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                {t('app.title')}
              </h1>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Intro Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            {t('intro.title')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t('intro.description')}
          </p>
        </div>

        {/* Niche Input */}
        <NicheInput
          value={niche}
          onChange={setNiche}
          onClear={handleClearNiche}
        />

        {/* Action Cards */}
        <ActionCards
          onGenerateIdea={handleGenerateIdea}
          onValidateIdea={handleValidateIdea}
          onGenerateKit={handleGenerateKit}
          loading={{
            generateIdea: generateIdeasMutation.isPending,
            validateIdea: validateIdeaMutation.isPending,
            generateKit: generatePromotionKitMutation.isPending,
          }}
        />

        {/* Results Display */}
        <ResultsDisplay
          ideas={results.ideas}
          validation={results.validation}
          promotionKit={results.promotionKit}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-600">
            <p className="mb-2">{t('footer.description')}</p>
            <p className="text-sm">{t('footer.note')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
