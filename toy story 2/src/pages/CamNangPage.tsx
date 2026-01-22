import React, { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/routePaths";
import { ArticleCard } from "../components/camnang/ArticleCard";
import { ArticleSidebar } from "../components/camnang/ArticleSidebar";
import { Pagination } from "../components/camnang/Pagination";
import { Search } from "lucide-react";

// Image assets from Figma
const imgImage98 = "https://www.figma.com/api/mcp/asset/9c66f851-eb86-472b-80d4-7fb5f1d55775";
const imgImage99 = "https://www.figma.com/api/mcp/asset/2055cafc-4c4e-4373-9a39-3418208929eb";
const imgLine23 = "https://www.figma.com/api/mcp/asset/8ee531aa-c46a-43f0-9a85-9e49cce91501";

// Mock article data - replace with API call later
interface Article {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl: string;
  category: string;
}

const mockArticles: Article[] = [
  {
    id: 1,
    title: "Rinh deal đón Tết, mua sớm giảm sâu đến 60%",
    excerpt: "Tết đến xuân về là dịp để ba mẹ dành tặng cho bé những món quà ý nghĩa, vừa mang niềm vui vừa giúp bé phát triển toàn diện. Thấu hiểu điều đó, chương trình \"Rinh deal đón Tết, mua sớm giảm sâu\" tại website ToyStory mang đến hàng loạt ưu đãi độc quyền online, giảm đến 60%, số lượng có hạn, ba mẹ nền mua sớm để hưởng lợi nhiều nhất!",
    author: "BTV Nguyễn Yến",
    date: "08.01.2026",
    imageUrl: imgImage99,
    category: "Khuyến mãi"
  },
  {
    id: 2,
    title: "Rinh deal đón Tết, mua sớm giảm sâu đến 60%",
    excerpt: "Tết đến xuân về là dịp để ba mẹ dành tặng cho bé những món quà ý nghĩa, vừa mang niềm vui vừa giúp bé phát triển toàn diện. Thấu hiểu điều đó, chương trình \"Rinh deal đón Tết, mua sớm giảm sâu\" tại website ToyStory mang đến hàng loạt ưu đãi độc quyền online, giảm đến 60%, số lượng có hạn, ba mẹ nền mua sớm để hưởng lợi nhiều nhất!",
    author: "BTV Nguyễn Yến",
    date: "08.01.2026",
    imageUrl: imgImage99,
    category: "Khuyến mãi"
  },
  {
    id: 3,
    title: "Rinh deal đón Tết, mua sớm giảm sâu đến 60%",
    excerpt: "Tết đến xuân về là dịp để ba mẹ dành tặng cho bé những món quà ý nghĩa, vừa mang niềm vui vừa giúp bé phát triển toàn diện. Thấu hiểu điều đó, chương trình \"Rinh deal đón Tết, mua sớm giảm sâu\" tại website ToyStory mang đến hàng loạt ưu đãi độc quyền online, giảm đến 60%, số lượng có hạn, ba mẹ nền mua sớm để hưởng lợi nhiều nhất!",
    author: "BTV Nguyễn Yến",
    date: "08.01.2026",
    imageUrl: imgImage99,
    category: "Khuyến mãi"
  },
  {
    id: 4,
    title: "Rinh deal đón Tết, mua sớm giảm sâu đến 60%",
    excerpt: "Tết đến xuân về là dịp để ba mẹ dành tặng cho bé những món quà ý nghĩa, vừa mang niềm vui vừa giúp bé phát triển toàn diện. Thấu hiểu điều đó, chương trình \"Rinh deal đón Tết, mua sớm giảm sâu\" tại website ToyStory mang đến hàng loạt ưu đãi độc quyền online, giảm đến 60%, số lượng có hạn, ba mẹ nền mua sớm để hưởng lợi nhiều nhất!",
    author: "BTV Nguyễn Yến",
    date: "08.01.2026",
    imageUrl: imgImage99,
    category: "Khuyến mãi"
  },
  {
    id: 5,
    title: "Rinh deal đón Tết, mua sớm giảm sâu đến 60%",
    excerpt: "Tết đến xuân về là dịp để ba mẹ dành tặng cho bé những món quà ý nghĩa, vừa mang niềm vui vừa giúp bé phát triển toàn diện. Thấu hiểu điều đó, chương trình \"Rinh deal đón Tết, mua sớm giảm sâu\" tại website ToyStory mang đến hàng loạt ưu đãi độc quyền online, giảm đến 60%, số lượng có hạn, ba mẹ nền mua sớm để hưởng lợi nhiều nhất!",
    author: "BTV Nguyễn Yến",
    date: "08.01.2026",
    imageUrl: imgImage99,
    category: "Khuyến mãi"
  },
  {
    id: 6,
    title: "Rinh deal đón Tết, mua sớm giảm sâu đến 60%",
    excerpt: "Tết đến xuân về là dịp để ba mẹ dành tặng cho bé những món quà ý nghĩa, vừa mang niềm vui vừa giúp bé phát triển toàn diện. Thấu hiểu điều đó, chương trình \"Rinh deal đón Tết, mua sớm giảm sâu\" tại website ToyStory mang đến hàng loạt ưu đãi độc quyền online, giảm đến 60%, số lượng có hạn, ba mẹ nền mua sớm để hưởng lợi nhiều nhất!",
    author: "BTV Nguyễn Yến",
    date: "08.01.2026",
    imageUrl: imgImage99,
    category: "Khuyến mãi"
  },
  {
    id: 7,
    title: "Cách chọn đồ chơi phù hợp cho trẻ từ 0-3 tuổi",
    excerpt: "Đồ chơi là công cụ quan trọng giúp trẻ phát triển các kỹ năng vận động, nhận thức và xã hội. Việc chọn đồ chơi phù hợp với độ tuổi sẽ giúp trẻ học hỏi và phát triển một cách tự nhiên nhất.",
    author: "BTV Minh Anh",
    date: "05.01.2026",
    imageUrl: imgImage99,
    category: "Tổng quan về Toy Story"
  },
  {
    id: 8,
    title: "10 mẹo dạy con ngoan hiền mà không cần la mắng",
    excerpt: "Nuôi dạy con cái là một hành trình đầy thử thách. Thay vì la mắng, ba mẹ có thể áp dụng những phương pháp tích cực để giúp con phát triển nhân cách tốt và biết cách ứng xử đúng đắn.",
    author: "BTV Lan Hương",
    date: "03.01.2026",
    imageUrl: imgImage99,
    category: "Dạy con ngoan hiền"
  },
  {
    id: 9,
    title: "Hoạt động vui chơi cùng con vào cuối tuần",
    excerpt: "Cuối tuần là thời gian tuyệt vời để ba mẹ và con cái cùng nhau tham gia các hoạt động vui chơi, tạo nên những kỷ niệm đẹp và gắn kết tình cảm gia đình.",
    author: "BTV Thanh Tùng",
    date: "01.01.2026",
    imageUrl: imgImage99,
    category: "Chơi cùng con"
  },
  {
    id: 10,
    title: "Dinh dưỡng hợp lý cho trẻ trong độ tuổi phát triển",
    excerpt: "Chế độ dinh dưỡng đóng vai trò quan trọng trong sự phát triển toàn diện của trẻ. Ba mẹ cần chú ý đến việc cung cấp đầy đủ các nhóm chất dinh dưỡng cần thiết cho con.",
    author: "BTV Hồng Nhung",
    date: "30.12.2025",
    imageUrl: imgImage99,
    category: "Nuôi con khỏe"
  },
  {
    id: 11,
    title: "Mẹo tiết kiệm khi mua đồ chơi cho con",
    excerpt: "Mua đồ chơi cho con không nhất thiết phải tốn kém. Với những mẹo nhỏ này, ba mẹ có thể tiết kiệm được một khoản đáng kể mà vẫn đảm bảo con có những món đồ chơi chất lượng và phù hợp.",
    author: "BTV Đức Anh",
    date: "28.12.2025",
    imageUrl: imgImage99,
    category: "Mẹo hữu ích"
  },
  {
    id: 12,
    title: "Thực đơn dinh dưỡng cho trẻ biếng ăn",
    excerpt: "Trẻ biếng ăn là nỗi lo của nhiều ba mẹ. Với thực đơn đa dạng và cách chế biến hấp dẫn, ba mẹ có thể giúp con ăn ngon miệng hơn và đảm bảo đủ chất dinh dưỡng.",
    author: "BTV Mai Linh",
    date: "25.12.2025",
    imageUrl: imgImage99,
    category: "Hôm nay cho con ăn gì ?"
  },
  {
    id: 13,
    title: "Khám phá các điểm vui chơi tại Thanh Hóa",
    excerpt: "Thanh Hóa có nhiều địa điểm vui chơi thú vị dành cho trẻ em. Cùng khám phá những nơi này để có những chuyến đi chơi đáng nhớ cùng gia đình.",
    author: "BTV Quang Minh",
    date: "22.12.2025",
    imageUrl: imgImage99,
    category: "Vòng quanh thanh hóa"
  }
];

const categories = [
  "Tổng quan về Toy Story",
  "Dạy con ngoan hiền",
  "Chơi cùng con",
  "Nuôi con khỏe",
  "Mẹo hữu ích",
  "Hôm nay cho con ăn gì ?",
  "Vòng quanh thanh hóa"
];

export const CamNangPage = (): React.JSX.Element => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 5; // Show 5 articles per page
  const articlesSectionRef = useRef<HTMLDivElement>(null);

  const filteredArticles = useMemo(() => {
    return mockArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / articlesPerPage));
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  return (
    <div className="bg-[#ab0007] relative min-h-screen w-full">
      {/* Breadcrumb */}
      <div className="bg-[#f2f2f2] border-[0.2px] border-black border-solid h-[36px] w-full flex items-center px-[58px]">
        <p className="font-rowdies text-[#582d2d] text-[10px] leading-[0]">
          <Link to={ROUTES.HOME} className="font-red-hat text-[#484848] no-underline hover:underline">
            Trang chủ
          </Link>
          <span className="text-black">  &gt;  </span>
          <span className="font-red-hat text-black">Cẩm nang</span>
        </p>
      </div>

      {/* Main Content Container */}
      <div className="bg-white relative w-full -mt-[2px]">
        {/* Hero Banner */}
        <div className="relative w-full h-[300px] overflow-hidden">
          <img
            alt="Hero banner"
            src={imgImage98}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="relative w-full px-[69px] pt-[32px] pb-[50px]">
          <div className="flex gap-[66px]">
            {/* Left Sidebar */}
            <div className="w-[245px] flex-shrink-0">
              {/* Search */}
              <div className="relative bg-white border border-[#536179] border-solid h-[37.692px] rounded-[111px] mb-[27px] flex items-center px-[7px]">
                <Search className="w-[14.487px] h-[14.487px] ml-[7px] text-[rgba(0,0,0,0.44)]" />
                <input
                  type="text"
                  placeholder="Nhập từ khóa tìm kiếm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-none outline-none font-sansation text-[12px] text-[rgba(0,0,0,0.44)] placeholder:text-[rgba(0,0,0,0.44)] ml-2 bg-transparent"
                />
              </div>

              {/* Category Sidebar */}
              <ArticleSidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
            </div>

            {/* Right Content Area */}
            <div className="flex-1">
              {/* Section Title */}
              <div className="mb-[30px]">
                <div className="h-px bg-black mb-[30px]" style={{ backgroundImage: `url(${imgLine23})` }} />
                <p className="font-rowdies text-[15px] text-black not-italic">
                  Tất cả bài viết
                </p>
              </div>

              {/* Articles List */}
              <div ref={articlesSectionRef} className="space-y-[27px]">
                {currentArticles.length > 0 ? (
                  currentArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="font-sansation text-black text-[14px]">
                      Không tìm thấy bài viết nào
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredArticles.length > 0 && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    // Scroll to articles section smoothly
                    setTimeout(() => {
                      articlesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 0);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CamNangPage;

