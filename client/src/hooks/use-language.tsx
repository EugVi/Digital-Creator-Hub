import { createContext, useContext, useState, ReactNode } from "react";

type Language = 'en' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'app.title': 'Digital Creator Hub',
    'intro.title': 'Create & Validate Digital Products',
    'intro.description': 'Generate innovative digital product ideas, validate them with AI analysis, and create ready-to-use promotion materials for your affiliate marketing campaigns.',
    'form.nicheLabel': 'Enter your niche or market area',
    'form.nichePlaceholder': 'e.g., Digital Marketing, Fitness, Personal Finance...',
    'form.clearButton': 'Clear',
    'actions.generateIdea.title': 'Generate Idea',
    'actions.generateIdea.description': 'Get innovative digital product ideas tailored to your niche with detailed descriptions and target audience analysis.',
    'actions.generateIdea.button': 'Generate Ideas',
    'actions.validateIdea.title': 'Validate Idea',
    'actions.validateIdea.description': 'Receive comprehensive market analysis, competition research, and viability assessment for your ideas.',
    'actions.validateIdea.button': 'Validate Ideas',
    'actions.generateKit.title': 'Promotion Kit',
    'actions.generateKit.description': 'Create ready-made promotional content including sales copy, social media posts, and affiliate materials.',
    'actions.generateKit.button': 'Create Kit',
    'results.generateIdea.title': 'Generated Product Ideas',
    'results.validateIdea.title': 'Idea Validation Report',
    'results.generateKit.title': 'Promotion Kit Ready',
    'validation.marketPotential': 'Market Potential',
    'validation.competitionLevel': 'Competition Level',
    'validation.feasibilityScore': 'Feasibility Score',
    'validation.strengths': 'Strengths',
    'validation.challenges': 'Challenges',
    'promotion.emailCampaign': 'Email Campaign',
    'promotion.socialMediaPosts': 'Social Media Posts',
    'promotion.affiliateResources': 'Affiliate Resources',
    'promotion.commissionRate': 'Commission Rate',
    'promotion.cookieDuration': 'Cookie Duration',
    'promotion.averageOrderValue': 'Average Order Value',
    'footer.description': 'Digital Creator Hub - Empowering creators with AI-powered tools',
    'footer.note': 'No login required • Multi-language support • Instant results',
    'error.nicheRequired': 'Please enter a niche first!',
    'error.ideaRequired': 'Please generate or enter an idea first!',
    'status.processing': 'Processing...',
    'status.success': 'Success!',
    'button.copyToClipboard': 'Copy to clipboard',
    'button.copied': 'Copied!'
  },
  pt: {
    'app.title': 'Hub do Criador Digital',
    'intro.title': 'Criar e Validar Produtos Digitais',
    'intro.description': 'Gere ideias inovadoras de produtos digitais, valide-as com análise de IA e crie materiais promocionais prontos para uso em suas campanhas de marketing de afiliados.',
    'form.nicheLabel': 'Digite seu nicho ou área de mercado',
    'form.nichePlaceholder': 'ex: Marketing Digital, Fitness, Finanças Pessoais...',
    'form.clearButton': 'Limpar',
    'actions.generateIdea.title': 'Gerar Ideia',
    'actions.generateIdea.description': 'Obtenha ideias inovadoras de produtos digitais personalizadas para seu nicho com descrições detalhadas e análise do público-alvo.',
    'actions.generateIdea.button': 'Gerar Ideias',
    'actions.validateIdea.title': 'Validar Ideia',
    'actions.validateIdea.description': 'Receba análise de mercado abrangente, pesquisa de concorrência e avaliação de viabilidade para suas ideias.',
    'actions.validateIdea.button': 'Validar Ideias',
    'actions.generateKit.title': 'Kit Promocional',
    'actions.generateKit.description': 'Crie conteúdo promocional pronto incluindo textos de vendas, posts para redes sociais e materiais para afiliados.',
    'actions.generateKit.button': 'Criar Kit',
    'results.generateIdea.title': 'Ideias de Produtos Geradas',
    'results.validateIdea.title': 'Relatório de Validação de Ideia',
    'results.generateKit.title': 'Kit Promocional Pronto',
    'validation.marketPotential': 'Potencial de Mercado',
    'validation.competitionLevel': 'Nível de Concorrência',
    'validation.feasibilityScore': 'Pontuação de Viabilidade',
    'validation.strengths': 'Pontos Fortes',
    'validation.challenges': 'Desafios',
    'promotion.emailCampaign': 'Campanha de Email',
    'promotion.socialMediaPosts': 'Posts para Redes Sociais',
    'promotion.affiliateResources': 'Recursos para Afiliados',
    'promotion.commissionRate': 'Taxa de Comissão',
    'promotion.cookieDuration': 'Duração do Cookie',
    'promotion.averageOrderValue': 'Valor Médio do Pedido',
    'footer.description': 'Hub do Criador Digital - Capacitando criadores com ferramentas de IA',
    'footer.note': 'Não requer login • Suporte multi-idioma • Resultados instantâneos',
    'error.nicheRequired': 'Por favor, insira um nicho primeiro!',
    'error.ideaRequired': 'Por favor, gere ou insira uma ideia primeiro!',
    'status.processing': 'Processando...',
    'status.success': 'Sucesso!',
    'button.copyToClipboard': 'Copiar para área de transferência',
    'button.copied': 'Copiado!'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
