import { Document } from '@contentful/rich-text-types';
import { EntryFieldTypes } from 'contentful';

export interface ArticleFields {
  contentTypeId: 'blogArticle';
  fields: {
    title: EntryFieldTypes.Text;
    slug: EntryFieldTypes.Text;
    excerpt?: EntryFieldTypes.Text;
    authorName?: EntryFieldTypes.Text;
    publishDate?: EntryFieldTypes.Date;
    coverImage?: EntryFieldTypes.AssetLink;
    category?: EntryFieldTypes.Text;
    content?: EntryFieldTypes.RichText;
  }
}

// Maps to what we actually use in the UI to abstract away Contentful's deeper structure
export interface ViewArticleDto {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl: string;
  category: string;
  content?: Document;
}
