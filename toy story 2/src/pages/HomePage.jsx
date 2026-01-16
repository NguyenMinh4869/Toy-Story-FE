import '../App.css'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import ProductSection from '../components/ProductSection'
import BrandsSection from '../components/BrandsSection'
import BlogSection from '../components/BlogSection'
import Footer from '../components/Footer'

function HomePage() {
  return (
    <div className="app">
      <Header />
      <HeroSection />
      <ProductSection 
        title="CƠ HỘI CUỐI"
        subtitle="MUA NHANH KẺO HẾT"
        hasGradient={true}
        products={[
          {
            image: "https://www.figma.com/api/mcp/asset/ddd8d83c-d216-4677-adb5-899a3f1d6fff",
            name: "Đồ Chơi Xe Tập Đi Đa Năng Có Nhạc Và Đèn Cho Bé VTECH 80-505600",
            price: "1.245.300 Đ",
            originalPrice: "1.779.000 Đ",
            discount: "-30%"
          },
          {
            image: "https://www.figma.com/api/mcp/asset/ddd8d83c-d216-4677-adb5-899a3f1d6fff",
            name: "Đồ Chơi Xe Tập Đi Đa Năng Có Nhạc Và Đèn Cho Bé VTECH 80-505600",
            price: "1.245.300 Đ",
            originalPrice: "1.779.000 Đ",
            discount: "-30%"
          },
          {
            image: "https://www.figma.com/api/mcp/asset/ddd8d83c-d216-4677-adb5-899a3f1d6fff",
            name: "Đồ Chơi Xe Tập Đi Đa Năng Có Nhạc Và Đèn Cho Bé VTECH 80-505600",
            price: "1.245.300 Đ",
            originalPrice: "1.779.000 Đ",
            discount: "-30%"
          },
          {
            image: "https://www.figma.com/api/mcp/asset/ddd8d83c-d216-4677-adb5-899a3f1d6fff",
            name: "Đồ Chơi Xe Tập Đi Đa Năng Có Nhạc Và Đèn Cho Bé VTECH 80-505600",
            price: "1.245.300 Đ",
            originalPrice: "1.779.000 Đ",
            discount: "-30%"
          }
        ]}
      />
      <ProductSection 
        title="GUNDAM KINGDOM"
        products={[
          {
            image: "https://www.figma.com/api/mcp/asset/7c5760c0-d3ad-409a-8fac-25043785610f",
            name: "GUNDAM HOT 2026 80-&4847 DA NANG",
            price: "1.245.300 Đ",
            originalPrice: "1.779.000 Đ",
            discount: "-30%"
          },
          {
            image: "https://www.figma.com/api/mcp/asset/7c5760c0-d3ad-409a-8fac-25043785610f",
            name: "GUNDAM HOT 2026 80-&4847 DA NANG",
            price: "1.245.300 Đ",
            originalPrice: "1.779.000 Đ",
            discount: "-30%"
          },
          {
            image: "https://www.figma.com/api/mcp/asset/7c5760c0-d3ad-409a-8fac-25043785610f",
            name: "GUNDAM HOT 2026 80-&4847 DA NANG",
            price: "1.245.300 Đ",
            originalPrice: "1.779.000 Đ",
            discount: "-30%"
          },
          {
            image: "https://www.figma.com/api/mcp/asset/7c5760c0-d3ad-409a-8fac-25043785610f",
            name: "GUNDAM HOT 2026 80-&4847 DA NANG",
            price: "1.245.300 Đ",
            originalPrice: "1.779.000 Đ",
            discount: "-30%"
          }
        ]}
      />
      <ProductSection 
        title="Đồ chơi yêu thích"
        products={[
          {
            image: "https://www.figma.com/api/mcp/asset/ea8dd4e8-ec41-449b-b606-2f8996b5be87",
            name: "GUNDAM HOT 2026 80-&4847 DA NANG",
            price: "1.245.300 Đ",
            originalPrice: "1.779.000 Đ",
            discount: "-30%"
          },
          {
            image: "https://www.figma.com/api/mcp/asset/ea8dd4e8-ec41-449b-b606-2f8996b5be87",
            name: "GUNDAM HOT 2026 80-&4847 DA NANG",
            price: "1.245.300 Đ",
            originalPrice: "1.779.000 Đ",
            discount: "-30%"
          },
          {
            image: "https://www.figma.com/api/mcp/asset/ea8dd4e8-ec41-449b-b606-2f8996b5be87",
            name: "GUNDAM HOT 2026 80-&4847 DA NANG",
            price: "1.245.300 Đ",
            originalPrice: "1.779.000 Đ",
            discount: "-30%"
          },
          {
            image: "https://www.figma.com/api/mcp/asset/ea8dd4e8-ec41-449b-b606-2f8996b5be87",
            name: "GUNDAM HOT 2026 80-&4847 DA NANG",
            price: "1.245.300 Đ",
            originalPrice: "1.779.000 Đ",
            discount: "-30%"
          }
        ]}
      />
      <BrandsSection />
      <BlogSection />
      <Footer />
    </div>
  )
}

export default HomePage

