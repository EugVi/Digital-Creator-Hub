import { generatedContent, type GeneratedContent, type InsertGeneratedContent } from "@shared/schema";

export interface IStorage {
  createGeneratedContent(content: InsertGeneratedContent): Promise<GeneratedContent>;
  getGeneratedContentBySession(sessionId: string): Promise<GeneratedContent[]>;
  getGeneratedContentByType(sessionId: string, type: string): Promise<GeneratedContent[]>;
}

export class MemStorage implements IStorage {
  private contents: Map<number, GeneratedContent>;
  private currentId: number;

  constructor() {
    this.contents = new Map();
    this.currentId = 1;
  }

  async createGeneratedContent(insertContent: InsertGeneratedContent): Promise<GeneratedContent> {
    const id = this.currentId++;
    const content: GeneratedContent = {
      ...insertContent,
      id,
      createdAt: new Date(),
    };
    this.contents.set(id, content);
    return content;
  }

  async getGeneratedContentBySession(sessionId: string): Promise<GeneratedContent[]> {
    return Array.from(this.contents.values()).filter(
      (content) => content.sessionId === sessionId,
    );
  }

  async getGeneratedContentByType(sessionId: string, type: string): Promise<GeneratedContent[]> {
    return Array.from(this.contents.values()).filter(
      (content) => content.sessionId === sessionId && content.type === type,
    );
  }
}

export const storage = new MemStorage();
