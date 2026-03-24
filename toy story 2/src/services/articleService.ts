import { apiGet, apiPost, apiDelete, apiPut } from './apiClient';
import type { 
  ViewArticleDto, 
  ViewArticleCategoryDto, 
  CreateArticleDto, 
  UpdateArticleDto, 
  CreateArticleCategoryDto, 
  UpdateArticleCategoryDto 
} from '../types/ArticleDTO';

// Article Endpoints
export const getArticles = async (categoryId?: number): Promise<ViewArticleDto[]> => {
  const endpoint = categoryId ? `/articles?categoryId=${categoryId}` : '/articles';
  const response = await apiGet<ViewArticleDto[]>(endpoint);
  return response.data;
};

export const getArticleById = async (id: number): Promise<ViewArticleDto> => {
  const response = await apiGet<ViewArticleDto>(`/articles/${id}`);
  return response.data;
};

export const createArticle = async (data: CreateArticleDto): Promise<void> => {
  await apiPost('/articles', data);
};

export const updateArticle = async (id: number, data: UpdateArticleDto): Promise<void> => {
  await apiPut(`/articles/${id}`, data);
};

export const deleteArticle = async (id: number): Promise<void> => {
  await apiDelete(`/articles/${id}`);
};

// Article Category Endpoints
export const getArticleCategories = async (): Promise<ViewArticleCategoryDto[]> => {
  const response = await apiGet<ViewArticleCategoryDto[]>('/article-categories');
  return response.data || [];
};

export const getArticleCategoryById = async (id: number): Promise<ViewArticleCategoryDto> => {
  const response = await apiGet<ViewArticleCategoryDto>(`/article-categories/${id}`);
  return response.data;
};

export const createArticleCategory = async (data: CreateArticleCategoryDto): Promise<void> => {
  await apiPost('/article-categories', data);
};

export const updateArticleCategory = async (id: number, data: UpdateArticleCategoryDto): Promise<void> => {
  await apiPut(`/article-categories/${id}`, data);
};

export const deleteArticleCategory = async (id: number): Promise<void> => {
  await apiDelete(`/article-categories/${id}`);
};
