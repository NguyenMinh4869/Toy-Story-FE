import React, { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ROUTES } from "../routes/routePaths"
import {
  getArticleById,
  getArticles,
  getArticleCategories,
} from "../services/articleService"
import type { ViewArticleDto, ViewArticleCategoryDto } from "../types/ArticleDTO"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Calendar, User, Share2, Search, Facebook, Twitter } from "lucide-react"

export const CamNangDetailPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<ViewArticleDto | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<ViewArticleDto[]>([])
  const [categories, setCategories] = useState<ViewArticleCategoryDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      setIsLoading(true)
      try {
        const articleId = Number(id)
        if (isNaN(articleId)) throw new Error("Invalid Article ID")
        
        const [fetchedArticle, allArticles, fetchedCategories] = await Promise.all([
          getArticleById(articleId),
          getArticles(),
          getArticleCategories(),
        ])

        setArticle(fetchedArticle)
        setCategories(fetchedCategories)

        if (fetchedArticle) {
          const related = allArticles
            .filter(a => a.articleCategoryId === fetchedArticle.articleCategoryId && a.articleId !== fetchedArticle.articleId)
            .slice(0, 4)
          setRelatedArticles(related)
        }
      } catch (error) {
        console.error("Failed to fetch article details:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (isLoading) {
    return (
      <div className="bg-[#ab0007] relative min-h-screen w-full flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p className="font-bold">Đang tải bài viết...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="bg-[#ab0007] relative min-h-screen w-full flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4 uppercase font-black">Bài viết không tồn tại</h1>
          <Link to={ROUTES.CAM_NANG} className="text-white underline hover:opacity-80 font-black">Quay lại trang Cẩm nang</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full bg-[#f2f2f2] min-h-screen">
      {/* Breadcrumb Section - Unified */}
      <div className="bg-[#f2f2f2] border-b border-gray-200">
        <div className="max-w-[1300px] mx-auto h-[40px] flex items-center px-6">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase text-gray-400">
                <Link to={ROUTES.HOME} className="hover:text-red-500 transition-colors tracking-widest">Trang chủ</Link>
                <span className="text-gray-300"> / </span>
                <Link to={ROUTES.CAM_NANG} className="hover:text-red-500 transition-colors tracking-widest">Cẩm nang</Link>
                <span className="text-gray-300"> / </span>
                <span className="text-black truncate max-w-[300px] font-black">{article.title}</span>
            </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-[1300px] mx-auto px-6 pt-12 pb-24">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar - Perfectly Unified with List Page */}
            <aside className="w-full lg:w-[280px] flex-shrink-0">
                <div className="sticky top-10 space-y-10">
                    {/* Search Bar */}
                    <div className="relative bg-white border border-gray-200 h-[50px] rounded-2xl flex items-center px-5 focus-within:ring-2 focus-within:ring-red-100 focus-within:border-red-400 transition-all group shadow-sm">
                        <Search className="w-4 h-4 text-gray-400 group-focus-within:text-red-400" />
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (searchQuery) navigate(`${ROUTES.CAM_NANG}?search=${encodeURIComponent(searchQuery)}`);
                            }}
                            className="flex-1"
                        >
                            <input
                                type="text"
                                placeholder="Tìm bài viết..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none outline-none ml-3 text-[14px] text-gray-700 font-medium placeholder:text-gray-400"
                            />
                        </form>
                    </div>

                    {/* Category List - match CamNangPage style */}
                    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                        <p className="text-[#ab0007] text-[11px] font-black mb-6 uppercase tracking-widest border-b border-red-100 pb-2">
                            Danh mục bài viết
                        </p>
                        <div className="space-y-1">
                          <Link
                            to={ROUTES.CAM_NANG}
                            className="block py-3 px-4 rounded-xl text-[13px] text-gray-600 hover:bg-gray-50 font-medium transition-all"
                          >
                            Tất cả bài viết
                          </Link>

                          {categories.map((cat) => (
                            <Link
                              key={cat.articleCategoryId}
                              to={`${ROUTES.CAM_NANG}?category=${encodeURIComponent(cat.name)}`}
                              className={`block py-3 px-4 rounded-xl text-[13px] transition-all ${
                                cat.articleCategoryId === article.articleCategoryId
                                  ? "bg-red-50 text-red-600 font-bold shadow-sm"
                                  : "text-gray-600 hover:bg-gray-50 font-medium"
                              }`}
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                    </div>

                    {/* Contact Box */}
                    <div className="bg-[#ab0007] p-10 rounded-[48px] text-white shadow-2xl shadow-red-100 hidden lg:block border-4 border-white">
                        <h3 className="font-black text-white text-[16px] uppercase mb-5 italic tracking-tight">Liên hệ tư vấn</h3>
                        <p className="text-[13px] text-red-100 leading-relaxed mb-10 font-medium opacity-90">Bạn cần hỗ trợ về sản phẩm hoặc phối màu cho bé? Các chuyên gia của ToyStory luôn sẵn sàng!</p>
                        <button className="w-full bg-white text-[#ab0007] font-black py-4 rounded-[24px] transition-all hover:scale-105 active:scale-95 shadow-xl uppercase text-[12px] tracking-widest">Hotline: 1900 xxxx</button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <article className="flex-1 min-w-0">
              <header className="mb-12">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <span className="bg-red-600 text-white px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.1em] shadow-lg shadow-red-100">
                        {article.categoryName}
                    </span>
                    <div className="flex items-center gap-2.5 text-gray-400 text-[13px] font-bold ml-1">
                        <Calendar size={15} className="text-gray-300" />
                        {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-[#20147b] leading-[1.1] mb-8 tracking-tight">
                  {article.title}
                </h1>

                <div className="flex items-center justify-between py-8 border-y border-gray-100">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-md">
                         <User size={24} className="text-gray-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest leading-none mb-1">Được viết bởi</span>
                        <span className="text-gray-900 text-[14px] font-semibold">{article.authorName}</span>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-5">
                      <span className="text-[11px] text-gray-400 uppercase font-black tracking-widest hidden sm:inline">Chia sẻ ngay</span>
                      <div className="flex gap-3">
                        <button className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center justify-center"><Facebook size={20} /></button>
                        <button className="w-11 h-11 rounded-full bg-gray-50 text-gray-900 hover:bg-black hover:text-white transition-all shadow-sm flex items-center justify-center"><Twitter size={20} /></button>
                        <button className="w-11 h-11 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center justify-center"><Share2 size={20} /></button>
                      </div>
                   </div>
                </div>
              </header>

              {/* Main Banner Image */}
              <div className="mb-16 rounded-[64px] overflow-hidden shadow-2xl shadow-blue-100/30 border-[12px] border-white group relative">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Reading Content */}
              <div className="article-content rich-text font-normal text-gray-800 leading-[1.7] text-[16px]">
                <div className="bg-gradient-to-br from-red-50 to-white p-10 rounded-[56px] mb-12 border-l-[16px] border-red-500 text-red-950 shadow-inner relative overflow-hidden">
                    <p className="relative z-10 text-[18px] font-bold leading-relaxed">"{article.shortDescription}"</p>
                </div>

                <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:normal-case prose-headings:text-[#20147b] prose-p:mb-5 prose-img:rounded-[32px] prose-img:shadow-lg prose-img:border-2 prose-img:border-white prose-blockquote:border-red-500 prose-blockquote:bg-gray-50 prose-blockquote:p-5 prose-blockquote:rounded-3xl">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {article.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Suggested Content */}
              <footer className="mt-32 pt-20 border-t border-gray-100">
                <div className="flex items-center justify-between mb-16">
                    <h3 className="text-2xl font-bold text-[#20147b] tracking-tight decoration-red-500 underline underline-offset-[10px] decoration-4">Bài viết liên quan</h3>
                    <Link to={ROUTES.CAM_NANG} className="text-sm font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">Xem tất cả →</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {relatedArticles.map((ra) => (
                     <Link key={ra.articleId} to={`/cam-nang/${ra.articleId}`} className="group no-underline flex gap-7 bg-white p-6 rounded-[48px] article-card-shadow border border-gray-50 items-center">
                        <div className="w-32 h-32 rounded-[32px] overflow-hidden flex-shrink-0 shadow-xl border-4 border-white">
                            <img src={ra.imageUrl} alt={ra.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="text-[11px] font-black text-red-500 uppercase mb-2 tracking-[0.2em]">{ra.categoryName || "Cẩm nang"}</span>
                            <h4 className="font-bold text-[#20147b] text-[18px] line-clamp-2 leading-tight group-hover:text-red-600 transition-colors tracking-tight">{ra.title}</h4>
                        </div>
                     </Link>
                  ))}
                </div>
              </footer>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CamNangDetailPage;
