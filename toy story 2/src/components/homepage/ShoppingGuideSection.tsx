import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";

// Figma MCP Asset URL
const image372 = "https://www.figma.com/api/mcp/asset/b779d896-3a23-4d57-adbf-13e2bd183230"; // Same as image37

export const ShoppingGuideSection = (): React.JSX.Element => {
  const articleData = {
    image: image372,
    title: "Cẩm nang mua đồ chơi không mua phải hàng giả",
    date: "07.01.2004",
    author: "Nguyen Hoang Minh",
    excerpt:
      "Mua đồ chơi cho con trai hay con gái thì mua ở chỗ tôi nhé có giảm giá cho người biết chơi đồ hoặc không biết chơi đồ biết chơi thì càng tốt có thể giảm giá mạng hehe hi hi haha hah ah ....",
    readMoreText: "Xem Thêm",
  };

  return (
    <article className="absolute top-[2621px] left-[149px] w-[402px] h-[364px] flex">
      <div className="w-[402px] h-[364px] relative bg-white rounded-[49px] overflow-hidden">
        <img
          className="absolute top-0 left-[46px] w-[297px] h-[151px] aspect-[1.97] object-cover"
          alt={articleData.title}
          src={articleData.image}
        />

        <h2 className="absolute top-[168px] left-[13px] [font-family:'Varela-Regular',Helvetica] text-[#004b6b] text-sm font-normal tracking-[0] leading-[normal]">
          {articleData.title}
        </h2>

        <time className="absolute top-[205px] left-[17px] [font-family:'Varela-Regular',Helvetica] font-normal text-black text-sm tracking-[0] leading-[normal]">
          {articleData.date}
        </time>

        <Link
          to={`${ROUTES.CAM_NANG}/1`}
          className="absolute top-[330px] left-[166px] [font-family:'Viga-Regular',Helvetica] font-normal text-[#ff0000] text-sm tracking-[0] leading-[normal] hover:underline focus:outline-none focus:ring-2 focus:ring-[#ff0000] focus:ring-offset-2 no-underline"
          aria-label={`${articleData.readMoreText}: ${articleData.title}`}
        >
          {articleData.readMoreText}
        </Link>

        <span className="absolute top-[205px] left-[235px] [font-family:'Varela-Regular',Helvetica] font-normal text-[#473a3a75] text-sm tracking-[0] leading-[normal]">
          {articleData.author}
        </span>

        <p className="absolute top-[249px] left-[17px] w-[356px] [font-family:'Varela-Regular',Helvetica] font-normal text-black text-[13px] tracking-[0] leading-[normal]">
          {articleData.excerpt}
        </p>
      </div>
    </article>
  );
};
