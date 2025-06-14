import { generatedContent, type GeneratedContent, type InsertGeneratedContent } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  createGeneratedContent(content: InsertGeneratedContent): Promise<GeneratedContent>;
  getGeneratedContentBySession(sessionId: string): Promise<GeneratedContent[]>;
  getGeneratedContentByType(sessionId: string, type: string): Promise<GeneratedContent[]>;
}

export class DatabaseStorage implements IStorage {
  async createGeneratedContent(insertContent: InsertGeneratedContent): Promise<GeneratedContent> {
    const [content] = await db
      .insert(generatedContent)
      .values(insertContent)
      .returning();
    return content;
  }

  async getGeneratedContentBySession(sessionId: string): Promise<GeneratedContent[]> {
    return await db
      .select()
      .from(generatedContent)
      .where(eq(generatedContent.sessionId, sessionId))
      .orderBy(generatedContent.createdAt);
  }

  async getGeneratedContentByType(sessionId: string, type: string): Promise<GeneratedContent[]> {
    return await db
      .select()
      .from(generatedContent)
      .where(and(
        eq(generatedContent.sessionId, sessionId),
        eq(generatedContent.type, type)
      ))
      .orderBy(generatedContent.createdAt);
  }
}

export const storage = new DatabaseStorage();
