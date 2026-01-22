import React from "react";
import { Link } from "react-router-dom";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl: string;
  category: string;
}

interface ArticleCardProps {
  article: Article;
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
            {article.date}  {article.author}
          </p>
          <p className="font-sansation text-black text-[12px] leading-normal line-clamp-3 mb-[8px]">
            {article.excerpt}
          </p>
        </div>
        
        <Link
          to={`/cam-nang/${article.id}`}
          className="font-rowdies text-[#b20000] text-[13px] not-italic hover:underline self-start"
        >
          Xem Thêm
        </Link>
      </div>
    </div>
  );
};

