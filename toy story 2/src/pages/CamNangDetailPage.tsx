import React from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../routes/routePaths";
import { RelatedArticleCard } from "../components/camnang/RelatedArticleCard";

// Image assets from Figma
const imgImage99 = "https://www.figma.com/api/mcp/asset/02aea93f-d959-4b6b-aae8-d83699d1d752";
const imgImage101 = "https://www.figma.com/api/mcp/asset/e1cd9356-9d87-4780-b0c6-e70dbdd6b544";
const imgImage102 = "https://www.figma.com/api/mcp/asset/af40b33d-feb5-4a36-b384-432957dd5d4a";
const imgLine31 = "https://www.figma.com/api/mcp/asset/4ae28e2f-a133-474c-90d1-707371c50559";

const categories = [
  "Tổng quan về Toy Story",
  "Dạy con ngoan hiền",
  "Chơi cùng con",
  "Nuôi con khỏe",
  "Mẹo hữu ích",
  "Hôm nay cho con ăn gì ?",
  "Vòng quanh thanh hóa"
];

// Mock article data - replace with API call later
interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  category: string;
  tableOfContents: TableOfContentsItem[];
  relatedArticles: RelatedArticle[];
}

interface TableOfContentsItem {
  id: string;
  title: string;
  children?: TableOfContentsItem[];
}

interface RelatedArticle {
  id: number;
  title: string;
  date: string;
  author: string;
  imageUrl: string;
}

const mockArticles: Article[] = [
  {
    id: 1,
    title: "Rinh deal đón Tết, mua sớm giảm sâu đến 60%",
    excerpt: "Tết đến xuân về là dịp để ba mẹ dành tặng cho bé những món quà ý nghĩa...",
    content: `Tết đến xuân về là dịp để ba mẹ dành tặng cho bé những món quà ý nghĩa, vừa mang niềm vui vừa giúp bé phát triển toàn diện. Thấu hiểu điều đó, chương trình "Rinh deal đón Tết, mua sớm giảm sâu" tại website ToyStory mang đến hàng loạt ưu đãi độc quyền online, giảm đến 60%, số lượng có hạn, ba mẹ nền mua sớm để hưởng lợi nhiều nhất!

Tết không chỉ là thời điểm sum vầy mà còn là mùa cao điểm mua sắm đồ chơi cho bé. Hiểu được nhu cầu đó, ToyStory triển khai chương trình khuyến mãi lớn ngay từ đầu năm, giúp ba mẹ:

• Tiết kiệm chi phí, deal hời giảm đến 60%: Mua sớm - giảm sâu, tránh tăng giá cận Tết.
• Săn deal độc quyền online: Chỉ áp dụng trên website, với hàng loạt mẫu hot cho bé.
• An tâm chất lượng: ToyStory cung cấp đồ chơi chính hãng, an toàn, phù hợp từng độ tuổi.
• Quà Tết ý nghĩa cho bé: Kích thích sáng tạo, tư duy và vận động.

👉 CHỐT ĐƠN NGAY: Deal độc quyền online`,
    author: "BTV Nguyễn Yến",
    date: "08.01.2026",
    imageUrl: imgImage99,
    category: "Khuyến mãi",
    tableOfContents: [
      {
        id: "1",
        title: "Mua sắm thông minh đón Tết – Vì sao nên chọn ToyStory?",
      },
      {
        id: "2",
        title: "Săn ngay những sản phẩm nổi bật cho mùa Tết 2026",
        children: [
          { id: "2.1", title: "Đồ Chơi Siêu Biến Hình Cỡ Lớn Có Đèn Chiến Binh Quả Cảm A TOBOT 301173" },
          { id: "2.2", title: "Hộp Búp Bê LOL Haribo LOL SURPRISE 119883-EUC" },
          { id: "2.3", title: "Đồ Chơi Trứng Khủng Long Tự Nở Bạo Chúa T-Rex PRIMAL HATCH 6072462" },
          { id: "2.4", title: "Đồ chơi hình khối nhựa mềm cho bé – 16 chi tiết PEEK A BOO PAB025" },
          { id: "2.5", title: "Đồ Chơi Lắp Ráp Pháo Hoa Tài Lộc LEGO Chinese Festival 80118" },
        ],
      },
      {
        id: "3",
        title: "Bí kíp săn deal cho ba mẹ",
      },
      {
        id: "4",
        title: "Rinh deal sớm – Tết vui trọn vẹn",
      },
    ],
    relatedArticles: [
      {
        id: 2,
        title: "SPIN GAME – Mua combo 2 giảm 30%: Cực cháy...",
        date: "08.01.2026",
        author: "BTV Nguyễn Yến",
        imageUrl: imgImage102,
      },
      {
        id: 3,
        title: "Khuyến mãi đặc biệt tháng 1",
        date: "05.01.2026",
        author: "BTV Minh Anh",
        imageUrl: imgImage102,
      },
    ],
  },
];

export const CamNangDetailPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const articleId = id ? parseInt(id, 10) : null;
  const article = articleId ? mockArticles.find((a) => a.id === articleId) : null;

  if (!article) {
    return (
      <div className="bg-[#ab0007] relative min-h-screen w-full flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="font-tilt-warp text-2xl mb-4">Bài viết không tồn tại</h1>
          <Link to={ROUTES.CAM_NANG} className="font-tilt-warp text-white underline hover:opacity-80">
            Quay lại trang Cẩm nang
          </Link>
        </div>
      </div>
    );
  }

  const handleTocClick = (itemId: string) => {
    const element = document.getElementById(itemId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-[#ab0007] relative min-h-screen w-full">
      {/* Breadcrumb */}
      <div className="bg-[#f2f2f2] border-[0.2px] border-black border-solid h-[36px] w-full flex items-center px-[58px]">
        <p className="font-rowdies text-[#582d2d] text-[10px] leading-[0]">
          <Link to={ROUTES.HOME} className="font-red-hat text-[#484848] no-underline hover:underline">
            Trang chủ
          </Link>
          <span className="text-black">  &gt;  </span>
          <Link to={ROUTES.CAM_NANG} className="font-red-hat text-[#484848] no-underline hover:underline">
            Cẩm nang
          </Link>
          <span className="text-black">  &gt;  </span>
          <span className="font-red-hat text-black">Xem thêm</span>
        </p>
      </div>

      {/* Main Content Container */}
      <div className="bg-white relative w-full -mt-[2px]">
        {/* Content Section */}
        <div className="relative w-full px-[46px] pt-[20px] pb-[50px]">
          <div className="flex gap-[120px] max-w-[1200px] mx-auto">
            {/* Left Sidebar */}
            <div className="w-[244px] flex-shrink-0">
              <div className="w-full">
                <p className="font-sansation font-bold text-[#ab0007] text-[12px] mb-[15px]">
                  DANH MỤC BÀI VIẾT
                </p>
                <div className="space-y-0">
                  {categories.map((category, index) => (
                    <div key={index}>
                      <Link
                        to={ROUTES.CAM_NANG}
                        className={`w-full text-left font-sansation text-[12px] text-black py-[12px] px-0 border-none bg-transparent cursor-pointer hover:text-[#ab0007] transition-colors block no-underline`}
                      >
                        {category}
                      </Link>
                      {index < categories.length - 1 && (
                        <div 
                          className="h-px w-full"
                          style={{ backgroundImage: `url(${imgLine31})` }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 max-w-[723px]">
              {/* Article Header */}
              <div className="mb-[20px]">
                <h1 className="font-sansation text-[#20147b] text-[24px] leading-normal mb-[20px]">
                  {article.title}
                </h1>
                <p className="font-red-hat text-black text-[12px] mb-[20px]">
                  {article.date}  {article.author}
                </p>
              </div>

              {/* Featured Image */}
              <div className="mb-[50px]">
                <div className="h-[387px] w-[553px] rounded-[15px] overflow-hidden">
                  <img
                    alt={article.title}
                    src={article.imageUrl}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Table of Contents */}
              <div className="mb-[50px]">
                <h2 className="font-red-hat font-normal text-[#0003ff] text-[14px] mb-[15px]">
                  NỘI DUNG BÀI VIẾT
                </h2>
                <ol className="list-decimal list-inside space-y-2 font-red-hat text-[#0003ff] text-[14px] ml-0">
                  {article.tableOfContents.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleTocClick(item.id)}
                        className="text-left underline hover:no-underline cursor-pointer"
                      >
                        {item.title}
                      </button>
                      {item.children && (
                        <ol className="list-decimal list-inside ml-6 mt-2 space-y-1">
                          {item.children.map((child) => (
                            <li key={child.id}>
                              <button
                                onClick={() => handleTocClick(child.id)}
                                className="text-left underline hover:no-underline cursor-pointer"
                              >
                                {child.title}
                              </button>
                            </li>
                          ))}
                        </ol>
                      )}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Article Content */}
              <div className="mb-[50px]">
                <div
                  id="1"
                  className="prose prose-sm max-w-none font-red-hat text-black text-[14px] leading-relaxed whitespace-pre-wrap"
                >
                  {article.content.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Section: Mua sắm thông minh */}
              <div id="2" className="mb-[50px]">
                <h2 className="font-red-hat font-semibold text-black text-[24px] mb-[20px]">
                  Mua sắm thông minh đón Tết – Vì sao nên chọn ToyStory?
                </h2>
                <div className="bg-[#f2f2f2] h-[282px] rounded-[17px] p-6">
                  {/* Content placeholder - can be filled with actual content */}
                </div>
              </div>

              {/* Section: Săn ngay những sản phẩm */}
              <div id="3" className="mb-[50px]">
                <h2 className="font-red-hat font-semibold text-black text-[24px] mb-[20px]">
                  Săn ngay những sản phẩm nổi bật cho mùa Tết 2026
                </h2>
                <div className="mb-[30px]">
                  <h3 className="font-red-hat font-bold text-black text-[14px] mb-[10px]">
                    Đồ Chơi Siêu Biến Hình Cỡ Lớn Có Đèn Chiến Binh Quả Cảm A TOBOT 301173
                  </h3>
                  <ul className="list-disc list-inside space-y-1 font-red-hat text-[14px] mb-[10px]">
                    <li>
                      <span className="font-bold">Giá bán: 1.112.300Đ – Giảm 30%</span>
                    </li>
                    <li>Giá gốc: 1.589.000Đ</li>
                    <li>Độ tuổi: Bé từ 4 tuổi</li>
                  </ul>
                  <p className="font-red-hat text-[14px] mb-[10px]">
                    Siêu phẩm dành cho các bé yêu thích robot và hành động. TOBOT cỡ lớn với khả năng biến hình ấn tượng, tích hợp đèn sinh động giúp bé nhập vai chiến binh quả cảm, phát triển trí tưởng tượng và khả năng vận động linh hoạt. Món quà Tết "chuẩn gu" cho các bé trai năng động.
                  </p>
                  <a
                    href="#"
                    className="font-red-hat text-[#2600ff] text-[14px] underline hover:no-underline"
                  >
                    MUA NGAY!
                  </a>
                </div>
              </div>

              {/* Large Image */}
              <div className="mb-[50px]">
                <img
                  alt="Article illustration"
                  src={imgImage101}
                  className="w-full h-auto rounded-[15px]"
                />
              </div>
            </div>

            {/* Right Sidebar - Related Articles */}
            <div className="w-[244px] flex-shrink-0">
              <h3 className="font-red-hat font-semibold text-black text-[14px] mb-[20px]">
                Có thể bạn sẽ thích
              </h3>
              <div className="space-y-[26px]">
                {article.relatedArticles.map((relatedArticle) => (
                  <RelatedArticleCard key={relatedArticle.id} article={relatedArticle} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CamNangDetailPage;

