import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";

interface RelatedArticle {
  id: number;
  title: string;
  date: string;
  author: string;
  imageUrl: string;
}

interface RelatedArticleCardProps {
  article: RelatedArticle;
}

export const RelatedArticleCard = ({ article }: RelatedArticleCardProps): React.JSX.Element => {
  return (
    <Link
      to={`${ROUTES.CAM_NANG}/${article.id}`}
      className="block bg-[#f2f2f2] h-[210px] rounded-[17px] overflow-hidden hover:opacity-90 transition-opacity"
    >
      <div className="h-[108px] w-full rounded-[14px] overflow-hidden mb-[11px]">
        <img
          alt={article.title}
          src={article.imageUrl}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="px-[24px] pb-[8px]">
        {article.title && (
          <h4 className="font-red-hat font-semibold text-black text-[14px] leading-normal line-clamp-2 mb-[8px]">
            {article.title}
          </h4>
        )}
        <p className="font-red-hat text-black text-[12px]">
          {article.date}  {article.author}
        </p>
      </div>
    </Link>
  );
};

