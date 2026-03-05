import { createClient } from 'contentful';
import type { Entry, Asset } from 'contentful';
import { Document } from '@contentful/rich-text-types';
import type { ArticleFields, ViewArticleDto } from '../types/ArticleDTO';

// Initialize Contentful Client (Only once per application as per user feedback)
const client = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || '',
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || '',
  // environment: 'master', // defaults to 'master', ContentfulClient handles this
});

/**
 * Standardize Contentful entry to our ViewArticleDto format
 */
const mapToDto = (entry: Entry<ArticleFields, undefined, string>): ViewArticleDto => {
  const fields = entry.fields;
  
  // Safely extract the image URL from the related Asset
  let imageUrl = 'https://via.placeholder.com/600x400';
  if (fields.coverImage && (fields.coverImage as unknown as Asset).fields?.file?.url) {
    imageUrl = (fields.coverImage as unknown as Asset).fields.file!.url as string;
    // Contentful URLs omit the protocol
    if (imageUrl.startsWith('//')) {
      imageUrl = `https:${imageUrl}`;
    }
  }

  // Format date safely
  const dateStr = fields.publishDate 
    ? new Date(fields.publishDate as unknown as string).toLocaleDateString('vi-VN') 
    : new Date(entry.sys.createdAt).toLocaleDateString('vi-VN');

  return {
    id: entry.sys.id,
    title: (fields.title as unknown as string) || 'Untitled',
    slug: (fields.slug as unknown as string) || entry.sys.id,
    excerpt: (fields.excerpt as unknown as string) || '',
    author: (fields.authorName as unknown as string) || 'Admin',
    date: dateStr,
    imageUrl,
    category: (fields.category as unknown as string) || 'Uncategorized',
    content: fields.content as unknown as Document,
  };
};

/**
 * Fetch all articles
 */
export const getArticles = async (): Promise<ViewArticleDto[]> => {
  try {
    const response = await client.getEntries<ArticleFields>({
      content_type: 'blogArticle', // The default ID Contentful assigns based on your prompt might be "blogArticle"
      order: ['-fields.publishDate'], // Try to order by publish date descending
    });
    
    return response.items.map(mapToDto);
  } catch (error) {
    console.error('Error fetching articles from Contentful:', error);
    // Return empty so the UI doesn't crash
    return [];
  }
};

/**
 * Fetch a single article by its ID
 */
export const getArticleById = async (id: string): Promise<ViewArticleDto | null> => {
  try {
    const entry = await client.getEntry<ArticleFields>(id);
    if (entry) {
      return mapToDto(entry);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching article with ID ${id}:`, error);
    return null;
  }
};

/**
 * Fetch all unique categories from articles
 * (A more robust way is a separate Content Type, but this works for MVP)
 */
export const getArticleCategories = async (): Promise<string[]> => {
  try {
    const response = await client.getEntries<ArticleFields>({
      content_type: 'blogArticle',
      select: ['fields.category'], // Only fetch the category field to be faster
    });

    // Extract unique categories, filter out undefined/empty
    const categories = response.items
      .map(item => item.fields.category as string)
      .filter(category => !!category);
      
    // Return unique set
    return Array.from(new Set(categories));
  } catch (error) {
    console.error('Error fetching article categories:', error);
    return [];
  }
};
