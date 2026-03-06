import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../routes/routePaths";
import { RelatedArticleCard } from "../components/camnang/RelatedArticleCard";
import { getArticleById, getArticles, getArticleCategories } from "../services/articleService";
import type { ViewArticleDto } from "../types/ArticleDTO";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { Calendar, User, Share2 } from "lucide-react";

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

  // Custom renderer for Contentful Rich Text
  const richTextOptions = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (_node: any, children: React.ReactNode) => <p className="mb-6 text-[#4a4a4a] text-[17px] leading-relaxed tracking-wide font-sansation">{children}</p>,
      [BLOCKS.HEADING_2]: (_node: any, children: React.ReactNode) => (
        <h2 className="font-tilt-warp text-[#ab0007] text-[28px] md:text-[32px] mb-[24px] mt-[48px] border-b border-gray-100 pb-3">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (_node: any, children: React.ReactNode) => (
        <h3 className="font-red-hat font-bold text-[#20147b] text-[22px] mb-[18px] mt-[36px]">{children}</h3>
      ),
      [BLOCKS.UL_LIST]: (_node: any, children: React.ReactNode) => (
        <ul className="list-disc list-outside space-y-3 mb-[28px] ml-6 text-[#4a4a4a] text-[17px] font-sansation marker:text-[#ab0007]">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (_node: any, children: React.ReactNode) => (
        <ol className="list-decimal list-outside space-y-3 mb-[28px] ml-6 text-[#4a4a4a] text-[17px] font-sansation marker:text-[#ab0007] font-semibold">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (_node: any, children: React.ReactNode) => <li className="pl-2 font-normal">{children}</li>,
      [BLOCKS.HR]: () => <hr className="my-10 border-t-2 border-dashed border-gray-200" />,
      [BLOCKS.QUOTE]: (_node: any, children: React.ReactNode) => (
        <blockquote className="relative border-l-[6px] border-[#ab0007] bg-[#fdf8f8] pl-6 pr-4 py-4 rounded-r-xl italic my-8 text-gray-700 font-sansation text-[18px] shadow-sm">
          <span className="absolute top-2 left-4 text-[#ab0007] text-4xl opacity-20 font-serif">"</span>
          {children}
        </blockquote>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const { url, description, title } = node.data.target.fields;
        return (
          <div className="my-[40px]">
            <img
              src={`https:${url}`}
              alt={description || title || 'Article image'}
              className="w-full h-auto rounded-[15px] object-cover"
            />
          </div>
        );
      },
      [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
        <a href={node.data.uri} target="_blank" rel="noopener noreferrer" className="text-[#2600ff] underline hover:no-underline">
          {children}
        </a>
      ),
    },
  };

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
          <div className="flex gap-[60px] max-w-[1240px] mx-auto">
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
            <div className="flex-1 max-w-[723px] bg-white rounded-[32px] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] box-border">
              {/* Article Header */}
              <div className="mb-[30px] text-center">
                <div className="inline-block bg-[#fdf5f5] px-4 py-1.5 rounded-full text-[#ab0007] text-xs font-bold uppercase tracking-wider mb-6">
                  {article.category}
                </div>
                <h1 className="font-tilt-warp text-[#20147b] text-[36px] md:text-[46px] leading-[1.2] mb-[24px]">
                  {article.title}
                </h1>
                <div className="flex items-center justify-center gap-4 text-gray-400 font-sansation text-[15px]">
                  <span className="flex items-center gap-1.5"><Calendar size={16} /> {article.date}</span>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                  <span className="flex items-center gap-1.5 text-[#ab0007] font-semibold"><User size={16} /> {article.author}</span>
                </div>
              </div>

              {/* Featured Image */}
              <div className="mb-[48px] relative group h-[400px]">
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                  <img
                    alt={article.title}
                    src={article.imageUrl}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute -bottom-4 right-8 bg-white px-6 py-2 rounded-xl shadow-md font-sansation text-[13px] text-gray-400 italic">
                  Ảnh minh họa
                </div>
              </div>

              {/* Article Content / Rich Text */}
              <div className="article-content max-w-none">
                {article.content ? (
                  documentToReactComponents(article.content, richTextOptions)
                ) : (
                  <p className="font-sansation text-lg text-gray-600">{article.excerpt || "Nội dung đang được cập nhật..."}</p>
                )}
              </div>

              {/* Bottom section with tags and share */}
              <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-red-hat text-gray-600 text-sm font-semibold">Tags:</span>
                  <span className="bg-gray-100 px-3 py-1.5 rounded-full text-[13px] text-gray-600 font-sansation cursor-pointer hover:bg-gray-200 transition-colors">#{article.category.replace(/\s+/g, '')}</span>
                  <span className="bg-gray-100 px-3 py-1.5 rounded-full text-[13px] text-gray-600 font-sansation cursor-pointer hover:bg-gray-200 transition-colors">#ToyStory</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-red-hat text-gray-500 text-sm flex items-center gap-1"><Share2 size={16} /> Chia sẻ</span>
                  <button className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:bg-blue-700 transition-colors font-bold text-lg">f</button>
                  <button className="w-9 h-9 rounded-full bg-[#46545b] text-white flex items-center justify-center hover:bg-gray-700 transition-colors font-bold">X</button>
                </div>
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

