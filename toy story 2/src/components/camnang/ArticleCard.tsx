import React from "react";
import { Link } from "react-router-dom";
import type { ViewArticleDto } from "../../types/ArticleDTO";
import { Calendar, User, ArrowRight } from "lucide-react";

interface ArticleCardProps {
  article: ViewArticleDto;
}

export const ArticleCard = ({ article }: ArticleCardProps): React.JSX.Element => {
  return (
    <Link 
        to={`/cam-nang/${article.articleId}`}
        className="group bg-white rounded-[32px] overflow-hidden flex flex-col md:flex-row gap-6 p-4 article-card-shadow border border-gray-50 no-underline"
    >
      {/* Article Image */}
      <div className="h-[200px] md:h-[180px] w-full md:w-[260px] rounded-[24px] overflow-hidden flex-shrink-0 shadow-inner">
        <img
          alt={article.title}
          src={article.imageUrl}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Article Content */}
      <div className="flex-1 flex flex-col justify-between py-2 pr-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                {article.categoryName || "Cẩm nang"}
            </span>
            <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-bold">
                <Calendar size={13} className="text-gray-300" />
                {new Date(article.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>

          <h3 className="text-[#20147b] text-[18px] md:text-[22px] font-black leading-tight mb-3 group-hover:text-red-500 transition-colors line-clamp-2">
            {article.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
             <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                <User size={12} className="text-gray-400" />
             </div>
             <span className="text-gray-500 text-[12px] font-bold">{article.authorName}</span>
          </div>

          <p className="text-gray-600 text-[13px] leading-relaxed line-clamp-2 mb-4 font-medium">
            {article.shortDescription}
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-red-500 text-[13px] font-black uppercase italic tracking-wider group-hover:gap-3 transition-all">
          Xem chi tiết
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
};

