import React from "react";

interface ArticleSidebarProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const imgLine24 = "https://www.figma.com/api/mcp/asset/023afac7-9be5-422d-9036-06d639602da1";

export const ArticleSidebar = ({
  categories,
  selectedCategory,
  onCategorySelect,
}: ArticleSidebarProps): React.JSX.Element => {
  return (
    <div className="w-full">
      <p className="font-sansation font-bold text-[#ab0007] text-[12px] mb-[15px]">
        DANH MỤC BÀI VIẾT
      </p>
      
      <div className="space-y-0">
        {categories.map((category, index) => (
          <div key={index}>
            <button
              onClick={() => onCategorySelect(selectedCategory === category ? null : category)}
              className={`w-full text-left font-sansation text-[12px] text-black py-[12px] px-0 border-none bg-transparent cursor-pointer hover:text-[#ab0007] transition-colors ${
                selectedCategory === category ? "text-[#ab0007] font-bold" : ""
              }`}
            >
              {category}
            </button>
            {index < categories.length - 1 && (
              <div 
                className="h-px w-full"
                style={{ backgroundImage: `url(${imgLine24})` }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

