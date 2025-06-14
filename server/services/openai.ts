import OpenAI from "openai";
import { ProductIdea, IdeaValidation, PromotionKit } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function generateProductIdeas(niche: string, language: 'en' | 'pt' = 'en'): Promise<ProductIdea[]> {
  const prompts = {
    en: `Generate 3 innovative digital product ideas for the "${niche}" niche. Focus on products that can be created and sold online (apps, courses, software, digital tools, etc.). For each idea, provide a compelling title, detailed description, target audience, realistic price range, category, and relevant tags. Return the response as JSON in this exact format: {"ideas": [{"title": "string", "description": "string", "targetAudience": "string", "priceRange": "string", "category": "string", "tags": ["string"]}]}`,
    pt: `Gere 3 ideias inovadoras de produtos digitais para o nicho "${niche}". Foque em produtos que podem ser criados e vendidos online (apps, cursos, software, ferramentas digitais, etc.). Para cada ideia, forneça um título atrativo, descrição detalhada, público-alvo, faixa de preço realista, categoria e tags relevantes. Retorne a resposta como JSON neste formato exato: {"ideas": [{"title": "string", "description": "string", "targetAudience": "string", "priceRange": "string", "category": "string", "tags": ["string"]}]}`
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: language === 'en' 
            ? "You are an expert digital product strategist. Generate practical, marketable digital product ideas."
            : "Você é um estrategista especialista em produtos digitais. Gere ideias práticas e comercializáveis de produtos digitais."
        },
        {
          role: "user",
          content: prompts[language]
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"ideas": []}');
    return result.ideas || [];
  } catch (error) {
    throw new Error(`Failed to generate product ideas: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function validateIdea(idea: string, niche: string, language: 'en' | 'pt' = 'en'): Promise<IdeaValidation> {
  const prompts = {
    en: `Analyze the viability of this digital product idea: "${idea}" in the "${niche}" niche. Provide a comprehensive validation including market potential (1-10), competition level (1-10), feasibility score (1-10), at least 3 strengths, at least 3 challenges, and an overall recommendation. Return as JSON in this format: {"marketPotential": number, "competitionLevel": number, "feasibilityScore": number, "strengths": ["string"], "challenges": ["string"], "recommendation": "string"}`,
    pt: `Analise a viabilidade desta ideia de produto digital: "${idea}" no nicho "${niche}". Forneça uma validação abrangente incluindo potencial de mercado (1-10), nível de concorrência (1-10), pontuação de viabilidade (1-10), pelo menos 3 pontos fortes, pelo menos 3 desafios e uma recomendação geral. Retorne como JSON neste formato: {"marketPotential": number, "competitionLevel": number, "feasibilityScore": number, "strengths": ["string"], "challenges": ["string"], "recommendation": "string"}`
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: language === 'en' 
            ? "You are a market research analyst specializing in digital products. Provide realistic, data-driven assessments."
            : "Você é um analista de pesquisa de mercado especializado em produtos digitais. Forneça avaliações realistas e baseadas em dados."
        },
        {
          role: "user",
          content: prompts[language]
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      marketPotential: Math.max(1, Math.min(10, result.marketPotential || 5)),
      competitionLevel: Math.max(1, Math.min(10, result.competitionLevel || 5)),
      feasibilityScore: Math.max(1, Math.min(10, result.feasibilityScore || 5)),
      strengths: result.strengths || [],
      challenges: result.challenges || [],
      recommendation: result.recommendation || ''
    };
  } catch (error) {
    throw new Error(`Failed to validate idea: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generatePromotionKit(idea: string, niche: string, language: 'en' | 'pt' = 'en'): Promise<PromotionKit> {
  const prompts = {
    en: `Create a comprehensive promotion kit for this digital product: "${idea}" in the "${niche}" niche. Generate: 1) Email campaign with subject and content, 2) 3 social media posts, 3) Affiliate resources including commission rate, cookie duration, average order value, and sales copy. Return as JSON: {"emailCampaign": {"subject": "string", "content": "string"}, "socialMediaPosts": ["string"], "affiliateResources": {"commissionRate": "string", "cookieDuration": "string", "averageOrderValue": "string", "salesCopy": "string"}}`,
    pt: `Crie um kit promocional abrangente para este produto digital: "${idea}" no nicho "${niche}". Gere: 1) Campanha de email com assunto e conteúdo, 2) 3 posts para redes sociais, 3) Recursos para afiliados incluindo taxa de comissão, duração do cookie, valor médio do pedido e texto de vendas. Retorne como JSON: {"emailCampaign": {"subject": "string", "content": "string"}, "socialMediaPosts": ["string"], "affiliateResources": {"commissionRate": "string", "cookieDuration": "string", "averageOrderValue": "string", "salesCopy": "string"}}`
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: language === 'en' 
            ? "You are a digital marketing expert specializing in product launches and affiliate marketing. Create compelling, conversion-focused content."
            : "Você é um especialista em marketing digital especializado em lançamentos de produtos e marketing de afiliados. Crie conteúdo atrativo e focado em conversão."
        },
        {
          role: "user",
          content: prompts[language]
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      emailCampaign: {
        subject: result.emailCampaign?.subject || '',
        content: result.emailCampaign?.content || ''
      },
      socialMediaPosts: result.socialMediaPosts || [],
      affiliateResources: {
        commissionRate: result.affiliateResources?.commissionRate || '30%',
        cookieDuration: result.affiliateResources?.cookieDuration || '60 days',
        averageOrderValue: result.affiliateResources?.averageOrderValue || '$87',
        salesCopy: result.affiliateResources?.salesCopy || ''
      }
    };
  } catch (error) {
    throw new Error(`Failed to generate promotion kit: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
