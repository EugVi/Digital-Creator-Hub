import { GoogleGenerativeAI } from "@google/generative-ai";
import { ProductIdea, IdeaValidation, PromotionKit } from "@shared/schema";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Country-specific cultural adaptations
const getCountryContext = (country: string, language: 'en' | 'pt') => {
  const contexts = {
    'United States': {
      en: 'Focus on side hustles, SaaS products, online courses, and digital marketing tools. Use American business terminology like "monetize", "scale", and "passive income". Popular formats include newsletters, mobile apps, and subscription services.',
      pt: 'Foque em trabalhos extras, produtos SaaS, cursos online e ferramentas de marketing digital. Use terminologia de negócios americana como "monetizar", "escalar" e "renda passiva". Formatos populares incluem newsletters, aplicativos móveis e serviços de assinatura.'
    },
    'Brazil': {
      en: 'Focus on WhatsApp business solutions, Instagram marketing, local e-commerce, and extra income opportunities. Use Brazilian Portuguese expressions and consider PIX payments, local marketplaces like Mercado Livre, and social selling strategies.',
      pt: 'Foque em soluções de negócios para WhatsApp, marketing no Instagram, e-commerce local e oportunidades de renda extra. Use expressões do português brasileiro e considere pagamentos PIX, marketplaces locais como Mercado Livre e estratégias de venda social.'
    },
    'Namibia': {
      en: 'Focus on accessible, low-cost digital products like simple PDFs with video tutorials, basic mobile solutions, and community-driven content. Prioritize motivational and educational content that works with limited internet connectivity.',
      pt: 'Foque em produtos digitais acessíveis e de baixo custo como PDFs simples com tutoriais em vídeo, soluções móveis básicas e conteúdo comunitário. Priorize conteúdo motivacional e educativo que funcione com conectividade limitada à internet.'
    },
    'United Kingdom': {
      en: 'Focus on professional development tools, fintech solutions, and premium content. Use British terminology and consider compliance with UK regulations. Popular formats include webinars, professional certifications, and B2B tools.',
      pt: 'Foque em ferramentas de desenvolvimento profissional, soluções fintech e conteúdo premium. Use terminologia britânica e considere conformidade com regulamentações do Reino Unido. Formatos populares incluem webinars, certificações profissionais e ferramentas B2B.'
    },
    'Germany': {
      en: 'Focus on engineering solutions, productivity tools, and privacy-focused products. Consider GDPR compliance and German preference for quality and precision. Popular formats include technical courses, software tools, and detailed guides.',
      pt: 'Foque em soluções de engenharia, ferramentas de produtividade e produtos focados em privacidade. Considere conformidade GDPR e preferência alemã por qualidade e precisão. Formatos populares incluem cursos técnicos, ferramentas de software e guias detalhados.'
    }
  };

  return contexts[country as keyof typeof contexts]?.[language] || contexts['United States'][language];
};

export async function generateProductIdeas(niche: string, country: string, language: 'en' | 'pt' = 'en'): Promise<ProductIdea[]> {
  const countryContext = getCountryContext(country, language);
  
  const prompts = {
    en: `Generate 3 innovative digital product ideas for the "${niche}" niche, specifically tailored for the ${country} market. 

Cultural Context: ${countryContext}

For each idea, provide:
- A compelling, market-appropriate title
- Detailed description (2-3 sentences)
- Specific target audience for ${country}
- Realistic price range in local context
- Appropriate category
- Relevant tags

Return ONLY a valid JSON object in this exact format:
{"ideas": [{"title": "string", "description": "string", "targetAudience": "string", "priceRange": "string", "category": "string", "tags": ["string"]}]}`,
    pt: `Gere 3 ideias inovadoras de produtos digitais para o nicho "${niche}", especificamente adaptadas para o mercado ${country === 'Brazil' ? 'brasileiro' : `de ${country}`}.

Contexto Cultural: ${countryContext}

Para cada ideia, forneça:
- Um título atrativo e apropriado para o mercado
- Descrição detalhada (2-3 frases)
- Público-alvo específico para ${country === 'Brazil' ? 'o Brasil' : country}
- Faixa de preço realista no contexto local
- Categoria apropriada
- Tags relevantes

Retorne APENAS um objeto JSON válido neste formato exato:
{"ideas": [{"title": "string", "description": "string", "targetAudience": "string", "priceRange": "string", "category": "string", "tags": ["string"]}]}`
  };

  try {
    const result = await model.generateContent(prompts[language]);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.ideas || [];
  } catch (error) {
    throw new Error(`Failed to generate product ideas: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function validateIdea(idea: string, niche: string, country: string, language: 'en' | 'pt' = 'en'): Promise<IdeaValidation> {
  const countryContext = getCountryContext(country, language);
  
  const prompts = {
    en: `Analyze the viability of this digital product idea: "${idea}" in the "${niche}" niche for the ${country} market.

Cultural Context: ${countryContext}

Consider local market conditions, competition, regulations, and cultural preferences specific to ${country}.

Provide scores (1-10) for:
- Market potential in ${country}
- Competition level
- Feasibility score considering local constraints

Also provide at least 3 strengths, 3 challenges, and an overall recommendation.

Return ONLY a valid JSON object:
{"marketPotential": number, "competitionLevel": number, "feasibilityScore": number, "strengths": ["string"], "challenges": ["string"], "recommendation": "string"}`,
    pt: `Analise a viabilidade desta ideia de produto digital: "${idea}" no nicho "${niche}" para o mercado ${country === 'Brazil' ? 'brasileiro' : `de ${country}`}.

Contexto Cultural: ${countryContext}

Considere condições de mercado local, concorrência, regulamentações e preferências culturais específicas ${country === 'Brazil' ? 'do Brasil' : `de ${country}`}.

Forneça pontuações (1-10) para:
- Potencial de mercado ${country === 'Brazil' ? 'no Brasil' : `em ${country}`}
- Nível de concorrência
- Pontuação de viabilidade considerando limitações locais

Também forneça pelo menos 3 pontos fortes, 3 desafios e uma recomendação geral.

Retorne APENAS um objeto JSON válido:
{"marketPotential": number, "competitionLevel": number, "feasibilityScore": number, "strengths": ["string"], "challenges": ["string"], "recommendation": "string"}`
  };

  try {
    const result = await model.generateContent(prompts[language]);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      marketPotential: Math.max(1, Math.min(10, parsed.marketPotential || 5)),
      competitionLevel: Math.max(1, Math.min(10, parsed.competitionLevel || 5)),
      feasibilityScore: Math.max(1, Math.min(10, parsed.feasibilityScore || 5)),
      strengths: parsed.strengths || [],
      challenges: parsed.challenges || [],
      recommendation: parsed.recommendation || ''
    };
  } catch (error) {
    throw new Error(`Failed to validate idea: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generatePromotionKit(idea: string, niche: string, country: string, language: 'en' | 'pt' = 'en'): Promise<PromotionKit> {
  const countryContext = getCountryContext(country, language);
  
  const prompts = {
    en: `Create a comprehensive promotion kit for this digital product: "${idea}" in the "${niche}" niche, specifically for the ${country} market.

Cultural Context: ${countryContext}

Generate culturally appropriate content including:
1. Email campaign (subject + content)
2. 3 social media posts adapted for ${country} audience
3. Affiliate resources with local market considerations

Use appropriate language, references, and marketing approaches for ${country}.

Return ONLY a valid JSON object:
{"emailCampaign": {"subject": "string", "content": "string"}, "socialMediaPosts": ["string"], "affiliateResources": {"commissionRate": "string", "cookieDuration": "string", "averageOrderValue": "string", "salesCopy": "string"}}`,
    pt: `Crie um kit promocional abrangente para este produto digital: "${idea}" no nicho "${niche}", especificamente para o mercado ${country === 'Brazil' ? 'brasileiro' : `de ${country}`}.

Contexto Cultural: ${countryContext}

Gere conteúdo culturalmente apropriado incluindo:
1. Campanha de email (assunto + conteúdo)
2. 3 posts para redes sociais adaptados para o público ${country === 'Brazil' ? 'brasileiro' : `de ${country}`}
3. Recursos para afiliados com considerações do mercado local

Use linguagem, referências e abordagens de marketing apropriadas para ${country === 'Brazil' ? 'o Brasil' : country}.

Retorne APENAS um objeto JSON válido:
{"emailCampaign": {"subject": "string", "content": "string"}, "socialMediaPosts": ["string"], "affiliateResources": {"commissionRate": "string", "cookieDuration": "string", "averageOrderValue": "string", "salesCopy": "string"}}`
  };

  try {
    const result = await model.generateContent(prompts[language]);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      emailCampaign: {
        subject: parsed.emailCampaign?.subject || '',
        content: parsed.emailCampaign?.content || ''
      },
      socialMediaPosts: parsed.socialMediaPosts || [],
      affiliateResources: {
        commissionRate: parsed.affiliateResources?.commissionRate || '30%',
        cookieDuration: parsed.affiliateResources?.cookieDuration || '60 days',
        averageOrderValue: parsed.affiliateResources?.averageOrderValue || '$87',
        salesCopy: parsed.affiliateResources?.salesCopy || ''
      }
    };
  } catch (error) {
    throw new Error(`Failed to generate promotion kit: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}