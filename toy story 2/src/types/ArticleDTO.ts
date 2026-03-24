export interface ViewArticleDto {
  articleId: number;
  articleCategoryId: number;
  categoryName?: string;
  title: string;
  shortDescription: string;
  content: string;
  imageUrl: string;
  authorName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ViewArticleCategoryDto {
  articleCategoryId: number;
  name: string;
  description: string;
}

export interface CreateArticleDto {
  articleCategoryId: number;
  title: string;
  shortDescription: string;
  content: string;
  imageUrl?: string;
  authorName: string;
}

export interface UpdateArticleDto {
  articleCategoryId: number;
  title: string;
  shortDescription: string;
  content: string;
  imageUrl?: string;
  authorName: string;
}

export interface CreateArticleCategoryDto {
  name: string;
  description: string;
}

export interface UpdateArticleCategoryDto {
  name: string;
  description: string;
}
