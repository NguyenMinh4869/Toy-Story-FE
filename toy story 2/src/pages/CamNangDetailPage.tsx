import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { ROUTES } from "../routes/routePaths"
import {
  getArticleById,
  getArticles,
  getArticleCategories,
} from "../services/articleService"
import type { ViewArticleDto, ViewArticleCategoryDto } from "../types/ArticleDTO"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Calendar, User, Share2, ChevronRight } from "lucide-react"



export const CamNangDetailPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<ViewArticleDto | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<ViewArticleDto[]>([])
  const [categories, setCategories] = useState<ViewArticleCategoryDto[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
          <p className="font-sansation">Đang tải bài viết...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="bg-[#ab0007] relative min-h-screen w-full flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="font-tilt-warp text-2xl mb-4 uppercase font-black">Bài viết không tồn tại</h1>
          <Link to={ROUTES.CAM_NANG} className="font-tilt-warp text-white underline hover:opacity-80 font-black">Quay lại trang Cẩm nang</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full bg-[#f2f2f2] font-['Red_Hat_Display']">
      <div className="bg-[#f2f2f2] border-b border-gray-200 h-[40px] w-full flex items-center px-[58px]">
        <div className="flex items-center gap-2 text-[11px] font-black uppercase text-gray-500">
          <Link to={ROUTES.HOME} className="hover:text-red-500 transition-colors">Trang chủ</Link>
          <ChevronRight size={12} />
          <Link to={ROUTES.CAM_NANG} className="hover:text-red-500 transition-colors">Cẩm nang</Link>
          <ChevronRight size={12} />
          <span className="text-black truncate max-w-[200px]">{article.title}</span>
        </div>
      </div>

      <div className="bg-white relative w-full">
        <div className="max-w-[1240px] mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar */}
            <aside className="w-full lg:w-[280px] flex-shrink-0">
              <div className="sticky top-10">
                <div className="mb-10">
                    <h3 className="font-black text-[#ab0007] text-xs uppercase tracking-widest mb-6 pb-2 border-b-2 border-red-500 inline-block">Danh mục bài viết</h3>
                    <div className="space-y-1">
                    {categories.map((cat) => (
                        <Link
                        key={cat.articleCategoryId}
                        to={`${ROUTES.CAM_NANG}?category=${encodeURIComponent(cat.name)}`}
                        className={`block py-3 px-4 rounded-xl text-[13px] transition-all ${cat.articleCategoryId === article.articleCategoryId ? "bg-red-50 text-red-600 font-black shadow-sm" : "text-gray-600 hover:bg-gray-50 font-bold"}`}
                        >
                        {cat.name}
                        </Link>
                    ))}
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
                    <h3 className="font-black text-gray-800 text-sm uppercase mb-6">Liên hệ tư vấn</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-6 font-bold">Bạn cần hỗ trợ về sản phẩm hoặc cách chăm sóc bé? Hãy liên hệ ngay với ToyStory!</p>
                    <button className="w-full bg-red-400 hover:bg-red-600 text-white font-black py-4 rounded-2xl transition-all shadow-md shadow-red-200 uppercase text-xs">Gọi ngay: 1900 xxxx</button>
                </div>
              </div>
            </aside>

            {/* Content */}
            <main className="flex-1 max-w-[800px]">
              <div className="mb-10">
                <div className="inline-block bg-red-50 text-red-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                  {article.categoryName}
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-[#20147b] leading-[1.2] mb-8 uppercase tracking-tight">{article.title}</h1>
                
                <div className="flex flex-wrap items-center gap-6 text-gray-500 text-xs font-black">
                  <span className="flex items-center gap-2"><Calendar size={16} className="text-red-400" /> {new Date(article.createdAt).toLocaleDateString('vi-VN')}</span>
                  <span className="flex items-center gap-2 text-red-600"><User size={16} className="text-red-400" /> {article.authorName}</span>
                  <div className="flex items-center gap-2 ml-auto">
                    <Share2 size={16} className="text-gray-400" />
                    <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition-transform">f</button>
                    <button className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform">X</button>
                  </div>
                </div>
              </div>

              <div className="rounded-[40px] overflow-hidden mb-12 shadow-2xl shadow-gray-200 border-8 border-white">
                <img alt={article.title} src={article.imageUrl} className="w-full h-auto object-cover" />
              </div>

              <div className="article-content rich-text font-medium text-gray-700 leading-[1.8] text-[17px]">
                <div className="bg-red-50 p-8 rounded-[32px] mb-10 italic font-bold border-l-8 border-red-400 text-red-800">
                    {article.shortDescription}
                </div>
                
                <div className="markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {article.content}
                    </ReactMarkdown>
                </div>
              </div>

              {/* Related */}
              <div className="mt-20 pt-16 border-t border-gray-100">
                <h3 className="text-2xl font-black text-[#20147b] mb-10 uppercase italic underline decoration-red-400 underline-offset-8">Có thể bạn quan tâm</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedArticles.map((ra) => (
                     <Link key={ra.articleId} to={`/cam-nang/${ra.articleId}`} className="group no-underline flex gap-4 bg-gray-50 p-4 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all border border-transparent hover:border-gray-100">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                            <img src={ra.imageUrl} alt={ra.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-[10px] font-black text-red-400 uppercase mb-1">{ra.categoryName}</span>
                            <h4 className="font-bold text-[#20147b] text-sm line-clamp-2 leading-snug group-hover:text-red-500 transition-colors">{ra.title}</h4>
                        </div>
                     </Link>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CamNangDetailPage
