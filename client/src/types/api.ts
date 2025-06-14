import { ProductIdea, IdeaValidation, PromotionKit } from "@shared/schema";

export interface ApiResponse<T> {
  success: boolean;
  error?: string;
  contentId?: number;
}

export interface GenerateIdeasResponse extends ApiResponse<ProductIdea[]> {
  ideas: ProductIdea[];
}

export interface ValidateIdeaResponse extends ApiResponse<IdeaValidation> {
  validation: IdeaValidation;
}

export interface GeneratePromotionKitResponse extends ApiResponse<PromotionKit> {
  promotionKit: PromotionKit;
}
