import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ROUTES } from "../routes/routePaths";
import { ArticleCard } from "../components/camnang/ArticleCard";
import { Pagination } from "../components/camnang/Pagination";
import { Search } from "lucide-react";
import { getArticles, getArticleCategories } from "../services/articleService";
import type { ViewArticleDto, ViewArticleCategoryDto } from "../types/ArticleDTO";

// Image assets from Figma

export const CamNangPage = (): React.JSX.Element => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [articles, setArticles] = useState<ViewArticleDto[]>([]);
  const [categories, setCategories] = useState<ViewArticleCategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryFromUrl);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 5;
  const articlesSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const [fetchedArticles, fetchedCategories] = await Promise.all([
          getArticles(),
          getArticleCategories(),
        ]);
        setArticles(fetchedArticles);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || article.categoryName === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Calculate pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / articlesPerPage),
  );
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  return (
    <div className="relative w-full bg-[#f2f2f2] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-[#f2f2f2] border-b border-gray-200">
        <div className="max-w-[1300px] mx-auto h-[40px] flex items-center px-6">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase text-gray-400">
            <Link to={ROUTES.HOME} className="hover:text-red-500 transition-colors">Trang chủ</Link>
            <span className="text-gray-300"> / </span>
            <span className="text-black">Cẩm nang</span>
            </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-[1300px] mx-auto px-6 pt-12 pb-24">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar */}
            <aside className="w-full lg:w-[280px] flex-shrink-0">
                <div className="sticky top-10 space-y-8">
                    {/* Search */}
                    <div className="relative bg-white border border-gray-200 h-[46px] rounded-2xl flex items-center px-4 focus-within:ring-2 focus-within:ring-red-100 focus-within:border-red-400 transition-all group shadow-sm">
                        <Search className="w-4 h-4 text-gray-400 group-focus-within:text-red-400" />
                        <input
                        type="text"
                        placeholder="Tìm bài viết..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none ml-2 text-[13px] text-gray-700 font-medium placeholder:text-gray-400"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                        <p className="text-[#ab0007] text-[11px] font-black mb-6 uppercase tracking-widest border-b border-red-100 pb-2">
                            Danh mục bài viết
                        </p>
                        <div className="space-y-1">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`w-full text-left py-3 px-4 rounded-xl text-[13px] transition-all ${!selectedCategory ? "bg-red-50 text-red-600 font-bold shadow-sm" : "text-gray-600 hover:bg-gray-50 font-medium"}`}
                        >
                            Tất cả bài viết
                        </button>
                        
                        {categories.map((category) => (
                            <button
                                key={category.articleCategoryId}
                                onClick={() => setSelectedCategory(category.name)}
                                className={`w-full text-left py-3 px-4 rounded-xl text-[13px] transition-all ${category.name === selectedCategory ? "bg-red-50 text-red-600 font-bold shadow-sm" : "text-gray-600 hover:bg-gray-50 font-medium"}`}
                            >
                                {category.name}
                            </button>
                        ))}
                        </div>
                    </div>

                    <div className="bg-[#ab0007] p-8 rounded-[40px] text-white shadow-xl shadow-red-100 hidden lg:block">
                        <h3 className="font-black text-white text-[15px] uppercase mb-4 italic tracking-tight">Liên hệ tư vấn</h3>
                        <p className="text-[12px] text-red-100 leading-relaxed mb-8 font-medium">Bạn cần hỗ trợ về sản phẩm hoặc cách chăm sóc bé? Hãy liên hệ ngay!</p>
                        <button className="w-full bg-white text-[#ab0007] font-black py-4 rounded-[20px] transition-all hover:scale-105 active:scale-95 shadow-lg uppercase text-[11px]">Gọi ngay: 1900 xxxx</button>
                    </div>
                </div>
            </aside>

            {/* Right Content Area */}
            <div className="flex-1">
              <div className="mb-10 flex items-center justify-between border-b-2 border-gray-100 pb-6">
                <h2 className="text-3xl font-black text-[#20147b] uppercase italic tracking-tight">
                  {selectedCategory || "Tất cả bài viết"}
                </h2>
                <span className="text-[11px] text-gray-400 font-black bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 uppercase tracking-wider">
                    {filteredArticles.length} bài viết
                </span>
              </div>

              <div ref={articlesSectionRef} className="space-y-8">
                {isLoading ? (
                  <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
                  </div>
                ) : currentArticles.length > 0 ? (
                  currentArticles.map((article) => (
                    <ArticleCard key={article.articleId} article={article} />
                  ))
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 font-bold">Không tìm thấy bài viết nào phù hợp.</p>
                  </div>
                )}
              </div>

              {filteredArticles.length > 0 && totalPages > 1 && (
                <div className="mt-12">
                    <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                        setTimeout(() => {
                        articlesSectionRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });
                        }, 0);
                    }}
                    />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CamNangPage;
