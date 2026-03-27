import { apiGet, apiPost, apiDelete, apiPut, apiPostForm, apiPutForm } from './apiClient';
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

export const createArticle = async (data: CreateArticleDto, imageFile?: File): Promise<void> => {
  // Prefer multipart when sending a file, otherwise fallback to JSON
  if (imageFile) {
    const form = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) form.append(key, String(value));
    });
    form.append('imageFile', imageFile);
    await apiPostForm('/articles', form);
    return;
  }

  await apiPost('/articles', data);
};

export const updateArticle = async (id: number, data: UpdateArticleDto, imageFile?: File): Promise<void> => {
  if (imageFile) {
    const form = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) form.append(key, String(value));
    });
    form.append('imageFile', imageFile);
    await apiPutForm(`/articles/${id}`, form);
    return;
  }

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
