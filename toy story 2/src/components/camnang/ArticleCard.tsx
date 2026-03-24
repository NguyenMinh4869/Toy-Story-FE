import React from "react";
import { Link } from "react-router-dom";
import type { ViewArticleDto } from "../../types/ArticleDTO";

interface ArticleCardProps {
  article: ViewArticleDto;
}

export const ArticleCard = ({ article }: ArticleCardProps): React.JSX.Element => {
  return (
    <div className="bg-[#f3f3f3] h-[202px] rounded-[18px] overflow-hidden flex gap-[35px] p-[8px]">
      {/* Article Image */}
      <div className="h-[186px] w-[265px] rounded-[15px] overflow-hidden flex-shrink-0">
        <img
          alt={article.title}
          src={article.imageUrl}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <div className="flex-1 flex flex-col justify-between py-[9px] pr-[7px]">
        <div>
          <h3 className="font-sansation text-[#20147b] text-[24px] leading-normal mb-[8px] line-clamp-2">
            {article.title}
          </h3>
          <p className="font-red-hat text-black text-[12px] mb-[3px]">
            {new Date(article.createdAt).toLocaleDateString('vi-VN')} | {article.authorName}  {article.categoryName && `| ${article.categoryName}`}
          </p>
          <p className="font-sansation text-black text-[12px] leading-normal line-clamp-3 mb-[8px]">
            {article.shortDescription}
          </p>
        </div>
        
        <Link
          to={`/cam-nang/${article.articleId}`}
          className="font-rowdies text-[#b20000] text-[13px] not-italic hover:underline self-start uppercase font-black"
        >
          Xem Thêm
        </Link>
      </div>
    </div>
  );
};

