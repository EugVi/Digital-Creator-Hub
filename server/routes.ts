import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  generateIdeaRequestSchema, 
  validateIdeaRequestSchema, 
  generatePromotionKitRequestSchema 
} from "@shared/schema";
import { generateProductIdeas, validateIdea, generatePromotionKit } from "./services/openai";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate product ideas
  app.post("/api/generate-ideas", async (req, res) => {
    try {
      const { niche, language } = generateIdeaRequestSchema.parse(req.body);
      const sessionId = req.sessionID || nanoid();
      
      const ideas = await generateProductIdeas(niche, language);
      
      const content = await storage.createGeneratedContent({
        sessionId,
        type: 'idea',
        niche,
        language,
        content: { ideas }
      });

      res.json({ 
        success: true, 
        ideas,
        contentId: content.id 
      });
    } catch (error) {
      console.error('Error generating ideas:', error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate ideas' 
      });
    }
  });

  // Validate idea
  app.post("/api/validate-idea", async (req, res) => {
    try {
      const { idea, niche, language } = validateIdeaRequestSchema.parse(req.body);
      const sessionId = req.sessionID || nanoid();
      
      const validation = await validateIdea(idea, niche, language);
      
      const content = await storage.createGeneratedContent({
        sessionId,
        type: 'validation',
        niche,
        language,
        content: { idea, validation }
      });

      res.json({ 
        success: true, 
        validation,
        contentId: content.id 
      });
    } catch (error) {
      console.error('Error validating idea:', error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to validate idea' 
      });
    }
  });

  // Generate promotion kit
  app.post("/api/generate-promotion-kit", async (req, res) => {
    try {
      const { idea, niche, language } = generatePromotionKitRequestSchema.parse(req.body);
      const sessionId = req.sessionID || nanoid();
      
      const promotionKit = await generatePromotionKit(idea, niche, language);
      
      const content = await storage.createGeneratedContent({
        sessionId,
        type: 'promotion',
        niche,
        language,
        content: { idea, promotionKit }
      });

      res.json({ 
        success: true, 
        promotionKit,
        contentId: content.id 
      });
    } catch (error) {
      console.error('Error generating promotion kit:', error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate promotion kit' 
      });
    }
  });

  // Get session content
  app.get("/api/content/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const contents = await storage.getGeneratedContentBySession(sessionId);
      
      res.json({ 
        success: true, 
        contents 
      });
    } catch (error) {
      console.error('Error fetching content:', error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch content' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
