import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/routePaths";
import { ArticleCard } from "../components/camnang/ArticleCard";
import { ArticleSidebar } from "../components/camnang/ArticleSidebar";
import { Pagination } from "../components/camnang/Pagination";
import { Search } from "lucide-react";
import { getArticles, getArticleCategories } from "../services/articleService";
import type { ViewArticleDto } from "../types/ArticleDTO";

// Image assets from Figma
const imgImage98 = "https://www.figma.com/api/mcp/asset/9c66f851-eb86-472b-80d4-7fb5f1d55775";
const imgLine23 = "https://www.figma.com/api/mcp/asset/8ee531aa-c46a-43f0-9a85-9e49cce91501";

export const CamNangPage = (): React.JSX.Element => {
  const [articles, setArticles] = useState<ViewArticleDto[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 5; 
  const articlesSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const [fetchedArticles, fetchedCategories] = await Promise.all([
          getArticles(),
          getArticleCategories()
        ]);
        setArticles(fetchedArticles);
        // Fallback categories if none exist yet
        setCategories(fetchedCategories.length > 0 ? fetchedCategories : [
          "Tổng quan về Toy Story", "Dạy con ngoan hiền", "Chơi cùng con", 
          "Nuôi con khỏe", "Mẹo hữu ích", "Hôm nay cho con ăn gì ?", "Vòng quanh thanh hóa"
        ]);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / articlesPerPage));
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  return (
    <div className="relative w-full bg-[#f2f2f2]">
      {/* Breadcrumb */}
      <div className="bg-[#f2f2f2] border-[0.2px] border-black border-solid h-[36px] w-full flex items-center px-[58px]">
        <p className="font-rowdies text-[#582d2d] text-[10px] leading-[0]">
          <Link to={ROUTES.HOME} className="font-red-hat text-[#484848] no-underline hover:underline">
            Trang chủ
          </Link>
          <span className="text-black">  &gt;  </span>
          <span className="font-red-hat text-black">Cẩm nang</span>
        </p>
      </div>

      {/* Main Content Container */}
      <div className="bg-white relative w-full -mt-[2px]">
        {/* Hero Banner */}
        <div className="relative w-full h-[300px] overflow-hidden">
          <img
            alt="Hero banner"
            src={imgImage98}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="relative w-full px-[69px] pt-[32px] pb-[50px]">
          <div className="flex gap-[66px]">
            {/* Left Sidebar */}
            <div className="w-[245px] flex-shrink-0">
              {/* Search */}
              <div className="relative bg-white border border-[#536179] border-solid h-[37.692px] rounded-[111px] mb-[27px] flex items-center px-[7px]">
                <Search className="w-[14.487px] h-[14.487px] ml-[7px] text-[rgba(0,0,0,0.44)]" />
                <input
                  type="text"
                  placeholder="Nhập từ khóa tìm kiếm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-none outline-none font-sansation text-[12px] text-[rgba(0,0,0,0.44)] placeholder:text-[rgba(0,0,0,0.44)] ml-2 bg-transparent"
                />
              </div>

              {/* Category Sidebar */}
              <ArticleSidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
            </div>

            {/* Right Content Area */}
            <div className="flex-1">
              {/* Section Title */}
              <div className="mb-[30px]">
                <div className="h-px bg-black mb-[30px]" style={{ backgroundImage: `url(${imgLine23})` }} />
                <p className="font-rowdies text-[15px] text-black not-italic">
                  Tất cả bài viết
                </p>
              </div>

              {/* Articles List */}
              <div ref={articlesSectionRef} className="space-y-[27px]">
                {isLoading ? (
                  <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#b20000]"></div>
                    <p className="font-sansation text-black text-[14px] mt-4">
                      Đang tải bài viết...
                    </p>
                  </div>
                ) : currentArticles.length > 0 ? (
                  currentArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="font-sansation text-black text-[14px]">
                      Không tìm thấy bài viết nào
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredArticles.length > 0 && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    // Scroll to articles section smoothly
                    setTimeout(() => {
                      articlesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 0);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CamNangPage;

