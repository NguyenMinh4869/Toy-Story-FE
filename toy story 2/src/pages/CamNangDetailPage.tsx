import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../routes/routePaths";
import { RelatedArticleCard } from "../components/camnang/RelatedArticleCard";
import { getArticleById, getArticles, getArticleCategories } from "../services/articleService";
import type { ViewArticleDto } from "../types/ArticleDTO";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Document, Block, Inline, Text } from '@contentful/rich-text-types';

// Helper to extract raw text string from Contentful's Rich Text JSON Document
const extractTextFromRichText = (document: Document): string => {
  if (!document || !document.content) return '';
  
  let text = '';
  const processNode = (node: Block | Inline | Text) => {
    if (node.nodeType === 'text') {
      text += (node as Text).value;
    } else if (node.nodeType === 'paragraph') {
      if (text.length > 0 && !text.endsWith('\n\n')) text += '\n\n';
      // @ts-ignore
      node.content?.forEach(processNode);
      text += '\n\n';
    } else if ((node as Block | Inline).content) {
      // @ts-ignore
      (node as Block | Inline).content.forEach(processNode);
    }
  };

  document.content.forEach(processNode);
  return text.trim();
};

// Image assets from Figma
const imgLine31 = "https://www.figma.com/api/mcp/asset/4ae28e2f-a133-474c-90d1-707371c50559";

export const CamNangDetailPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>(); // Context: id parameter holds the slug
  
  const [article, setArticle] = useState<ViewArticleDto | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ViewArticleDto[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const [fetchedArticle, allArticles, fetchedCategories] = await Promise.all([
          getArticleById(id),
          getArticles(), 
          getArticleCategories()
        ]);
        
        setArticle(fetchedArticle);
        
        // Find related articles (same category, exclude current)
        if (fetchedArticle) {
          const related = allArticles
            .filter(a => a.category === fetchedArticle.category && a.id !== fetchedArticle.id)
            .slice(0, 3); // Top 3 related
          setRelatedArticles(related);
        }
        
        setCategories(fetchedCategories.length > 0 ? fetchedCategories : [
          "Tổng quan về Toy Story", "Dạy con ngoan hiền", "Chơi cùng con", 
          "Nuôi con khỏe", "Mẹo hữu ích", "Hôm nay cho con ăn gì ?", "Vòng quanh thanh hóa"
        ]);
      } catch (error) {
        console.error("Failed to fetch article details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="bg-[#ab0007] relative min-h-screen w-full flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p className="font-sansation">Đang tải cấu trúc bài viết...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-[#ab0007] relative min-h-screen w-full flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="font-tilt-warp text-2xl mb-4">Bài viết không tồn tại</h1>
          <Link to={ROUTES.CAM_NANG} className="font-tilt-warp text-white underline hover:opacity-80">
            Quay lại trang Cẩm nang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-[#f2f2f2]">
      {/* Breadcrumb */}
      <div className="bg-[#f2f2f2] border-[0.2px] border-black border-solid h-[36px] w-full flex items-center px-[58px]">
        <p className="font-rowdies text-[#582d2d] text-[10px] leading-[0]">
          <Link to={ROUTES.HOME} className="font-red-hat text-[#484848] no-underline hover:underline">
            Trang chủ
          </Link>
          <span className="text-black">  &gt;  </span>
          <Link to={ROUTES.CAM_NANG} className="font-red-hat text-[#484848] no-underline hover:underline">
            Cẩm nang
          </Link>
          <span className="text-black">  &gt;  </span>
          <span className="font-red-hat text-black">{article.title}</span>
        </p>
      </div>

      {/* Main Content Container */}
      <div className="bg-white relative w-full -mt-[2px]">
        {/* Content Section */}
        <div className="relative w-full px-[46px] pt-[20px] pb-[50px]">
          <div className="flex gap-[120px] max-w-[1200px] mx-auto">
            {/* Left Sidebar */}
            <div className="w-[244px] flex-shrink-0 hidden md:block">
              <div className="w-full sticky top-[20px]">
                <p className="font-sansation font-bold text-[#ab0007] text-[12px] mb-[15px]">
                  DANH MỤC BÀI VIẾT
                </p>
                <div className="space-y-0">
                  {categories.map((category, index) => (
                    <div key={index}>
                      <Link
                        to={`${ROUTES.CAM_NANG}?category=${encodeURIComponent(category)}`}
                        className={`w-full text-left font-sansation text-[12px] ${category === article.category ? 'text-[#ab0007] font-bold' : 'text-black'} py-[12px] px-0 border-none bg-transparent cursor-pointer hover:text-[#ab0007] transition-colors block no-underline`}
                      >
                        {category}
                      </Link>
                      {index < categories.length - 1 && (
                        <div 
                          className="h-px w-full"
                          style={{ backgroundImage: `url(${imgLine31})` }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 max-w-[723px]">
              {/* Article Header */}
              <div className="mb-[20px]">
                <h1 className="font-sansation text-[#20147b] text-[32px] md:text-[40px] leading-tight mb-[20px]">
                  {article.title}
                </h1>
                <div className="flex items-center gap-4 text-gray-500 font-red-hat text-[14px]">
                  <span>{article.date}</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>{article.author}</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span className="bg-[#f0f0f0] px-3 py-1 rounded-full text-[#b20000] text-xs font-semibold">{article.category}</span>
                </div>
              </div>

              {/* Featured Image */}
              <div className="mb-[40px]">
                <div className="w-full rounded-[15px] overflow-hidden aspect-[16/9] shadow-md border border-gray-100">
                  <img
                    alt={article.title}
                    src={article.imageUrl}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Article Content / Rich Text */}
              <div className="article-content prose prose-lg max-w-none font-red-hat text-[16px] leading-[1.8] whitespace-pre-wrap">
                {article.content ? (
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="font-sansation text-[#20147b] text-[28px] md:text-[32px] font-bold mt-[40px] mb-[20px]" {...props} />,
                      h2: ({node, ...props}) => <h2 className="font-red-hat font-semibold text-black text-[24px] mb-[20px] mt-[40px]" {...props} />,
                      h3: ({node, ...props}) => <h3 className="font-red-hat font-bold text-black text-[18px] mb-[15px] mt-[30px]" {...props} />,
                      p: ({node, ...props}) => <p className="mb-4 text-[#333]" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-[20px] ml-4 text-[#333]" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-[20px] ml-4 text-[#333]" {...props} />,
                      li: ({node, ...props}) => <li className="text-[#333]" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#b20000] pl-4 italic my-6 text-gray-700" {...props} />,
                      a: ({node, ...props}) => <a className="text-[#2600ff] underline hover:no-underline" target="_blank" rel="noopener noreferrer" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-black" {...props} />,
                    }}
                  >
                    {extractTextFromRichText(article.content)}
                  </ReactMarkdown>
                ) : (
                  <p>{article.excerpt || "Nội dung đang được cập nhật..."}</p>
                )}
              </div>
            </div>

            {/* Right Sidebar - Related Articles */}
            <div className="w-[244px] flex-shrink-0">
              <h3 className="font-red-hat font-semibold text-black text-[14px] mb-[20px]">
                Có thể bạn sẽ thích
              </h3>
              <div className="space-y-[26px]">
                {relatedArticles.map((relatedArticle) => (
                  <RelatedArticleCard key={relatedArticle.id} article={relatedArticle} />
                ))}
                {relatedArticles.length === 0 && (
                  <p className="text-sm font-red-hat text-gray-500">Chưa có bài viết liên quan.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CamNangDetailPage;

