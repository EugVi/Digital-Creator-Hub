import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const generatedContent = pgTable("generated_content", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  type: text("type").notNull(), // 'idea', 'validation', 'promotion'
  niche: text("niche").notNull(),
  country: text("country").notNull(),
  language: text("language").notNull().default('en'),
  content: jsonb("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGeneratedContentSchema = createInsertSchema(generatedContent).omit({
  id: true,
  createdAt: true,
});

export type InsertGeneratedContent = z.infer<typeof insertGeneratedContentSchema>;
export type GeneratedContent = typeof generatedContent.$inferSelect;

// API Request/Response schemas
export const generateIdeaRequestSchema = z.object({
  niche: z.string().min(1, "Niche is required"),
  language: z.enum(['en', 'pt']).default('en'),
  country: z.string().min(1, "Country is required"),
});

export const validateIdeaRequestSchema = z.object({
  idea: z.string().min(1, "Idea is required"),
  niche: z.string().min(1, "Niche is required"),
  language: z.enum(['en', 'pt']).default('en'),
  country: z.string().min(1, "Country is required"),
});

export const generatePromotionKitRequestSchema = z.object({
  idea: z.string().min(1, "Idea is required"),
  niche: z.string().min(1, "Niche is required"),
  language: z.enum(['en', 'pt']).default('en'),
  country: z.string().min(1, "Country is required"),
});

export type GenerateIdeaRequest = z.infer<typeof generateIdeaRequestSchema>;
export type ValidateIdeaRequest = z.infer<typeof validateIdeaRequestSchema>;
export type GeneratePromotionKitRequest = z.infer<typeof generatePromotionKitRequestSchema>;

export interface ProductIdea {
  title: string;
  description: string;
  targetAudience: string;
  priceRange: string;
  category: string;
  tags: string[];
}

export interface IdeaValidation {
  marketPotential: number;
  competitionLevel: number;
  feasibilityScore: number;
  strengths: string[];
  challenges: string[];
  recommendation: string;
}

export interface PromotionKit {
  emailCampaign: {
    subject: string;
    content: string;
  };
  socialMediaPosts: string[];
  affiliateResources: {
    commissionRate: string;
    cookieDuration: string;
    averageOrderValue: string;
    salesCopy: string;
  };
}
