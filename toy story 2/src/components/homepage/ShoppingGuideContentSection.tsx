import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";

// Figma MCP Asset URLs
const decorDynamicBrand252 = "https://www.figma.com/api/mcp/asset/c18966b1-02ef-44dc-b6e0-7ce67b29570f"; // Same as decorDynamicBrand21
const image37 = "https://www.figma.com/api/mcp/asset/b779d896-3a23-4d57-adbf-13e2bd183230";

export const ShoppingGuideContentSection = (): React.JSX.Element => {
  const articleData = {
    image: image37,
    title: "Cẩm nang mua đồ chơi không mua phải hàng giả",
    date: "07.01.2004",
    author: "Nguyen Hoang Minh",
    excerpt:
      "Mua đồ chơi cho con trai hay con gái thì mua ở chỗ tôi nhé có giảm giá cho người biết chơi đồ hoặc không biết chơi đồ biết chơi thì càng tốt có thể giảm giá mạng hehe hi hi haha hah ah ....",
  };

  return (
    <article className="absolute top-[2589px] left-[649px] w-[405px] h-[393px]">
      <div className="absolute top-[29px] left-0 w-[402px] h-[364px] bg-white rounded-[49px] overflow-hidden">
        <img
          className="absolute top-0 left-[46px] w-[297px] h-[151px] aspect-[1.97] object-cover"
          alt={articleData.title}
          src={articleData.image}
        />

        <h2 className="absolute top-[168px] left-[13px] [font-family:'Varela-Regular',Helvetica] text-[#004b6b] text-sm font-normal tracking-[0] leading-[normal]">
          {articleData.title}
        </h2>

        <time
          className="absolute top-[205px] left-[17px] [font-family:'Varela-Regular',Helvetica] font-normal text-black text-sm tracking-[0] leading-[normal]"
          dateTime="2004-01-07"
        >
          {articleData.date}
        </time>

        <Link
          to={`${ROUTES.CAM_NANG}/1`}
          className="absolute top-[330px] left-[166px] [font-family:'Viga-Regular',Helvetica] text-sm font-normal text-[#ff0000] tracking-[0] leading-[normal] hover:underline focus:outline-none focus:ring-2 focus:ring-[#ff0000] focus:ring-offset-2 no-underline"
        >
          Xem Thêm
        </Link>

        <div className="absolute top-[205px] left-[235px] [font-family:'Varela-Regular',Helvetica] font-normal text-[#473a3a75] text-sm tracking-[0] leading-[normal]">
          {articleData.author}
        </div>

        <p className="absolute top-[249px] left-[17px] w-[356px] [font-family:'Varela-Regular',Helvetica] font-normal text-black text-[13px] tracking-[0] leading-[normal]">
          {articleData.excerpt}
        </p>
      </div>

      <img
        className="top-0 left-1.5 w-[399px] h-[67px] absolute aspect-[6] object-cover"
        alt="Decorative brand element"
        src={decorDynamicBrand252}
      />
    </article>
  );
};
