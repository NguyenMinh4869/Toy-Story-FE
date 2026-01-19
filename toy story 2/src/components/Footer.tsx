import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#ab0007] text-white relative">
      <div className="flex w-full h-[39px] overflow-hidden max-xl:hidden">
        {[...Array(50)].map((_, i) => (
          <img 
            key={i}
            src="https://www.figma.com/api/mcp/asset/1f5f2438-2e1a-4bad-9277-37d56d8daf39" 
            alt="Decoration" 
            className="w-[116px] h-[39px] flex-shrink-0"
          />
        ))}
      </div>
      <div className="bg-[#af0000] h-[17px] flex justify-around items-center px-5">
        <div className="flex items-center gap-2 font-rowdies text-[4px] text-white">
          <img 
            src="https://www.figma.com/api/mcp/asset/6849fe38-3f44-43c3-91d6-a32c6ff0279d" 
            alt="Icon" 
            className="w-[15px] h-[11px]"
          />
          <span>miễn phí giao hàng đơn 200k</span>
        </div>
        <div className="flex items-center gap-2 font-rowdies text-[4px] text-white">
          <img 
            src="https://www.figma.com/api/mcp/asset/6849fe38-3f44-43c3-91d6-a32c6ff0279d" 
            alt="Icon" 
            className="w-[15px] h-[11px]"
          />
          <span>miễn phí giao hàng đơn 200k</span>
        </div>
        <div className="flex items-center gap-2 font-rowdies text-[4px] text-white">
          <img 
            src="https://www.figma.com/api/mcp/asset/6849fe38-3f44-43c3-91d6-a32c6ff0279d" 
            alt="Icon" 
            className="w-[15px] h-[11px]"
          />
          <span>miễn phí giao hàng đơn 200k</span>
        </div>
      </div>
      <div className="bg-white p-[8px_113px_0] grid grid-cols-3 gap-10 text-black max-w-[1800px] mx-auto max-xl:grid-cols-1 max-xl:p-5">
        <div className="p-0">
          <div className="mb-[15px]">
            <img 
              src="https://www.figma.com/api/mcp/asset/a3292b82-feb6-483d-a4f2-619ec8b796dd" 
              alt="Logo" 
              className="h-[47px] w-auto"
            />
          </div>
          <p className="font-tilt-neon text-[10px] text-black m-0 mb-2.5 leading-[1.1]">
            Tham gia ngay để nhận về tay thông tin ưu đãi và hữu ích từ Mykingdom
          </p>
          <p className="font-thasadith text-[10px] text-black m-0 mb-5">*Bạn có thể hủy đăng ký bất kỳ lúc nào!</p>
          <div className="flex gap-2 mb-10 pb-[15px] border-b border-black/20">
            <input 
              type="email" 
              placeholder="Nhập email của bạn" 
              className="flex-1 border-none border-b border-black/20 py-[5px] px-0 font-thasadith text-[9px] outline-none"
            />
            <button className="bg-[#ca002a] text-white font-tilt-warp text-[10px] py-[5px] px-[18px] border-none rounded-[9px] cursor-pointer">Đăng kí</button>
          </div>
          <div>
            <h4 className="font-tilt-warp text-sm text-[#ca002a] m-0 mb-[15px]">Thông tin liên hệ</h4>
            <ul className="list-none p-0 m-0">
              <li className="font-red-hat text-[10px] mb-2 leading-[1.5]">33-35 Đường Ngô Thị Bì, Khu Đô Thị Mới Him Lam, Phường Tân Hưng, TP.Hồ Chí Minh</li>
              <li className="font-red-hat text-[10px] mb-2 leading-[1.5]"><a href="tel:19001208" className="text-black underline hover:text-[#ca002a]">19001208</a></li>
              <li className="font-red-hat text-[10px] mb-2 leading-[1.5]"><a href="mailto:hotro@mykingdom.com.vn" className="text-black underline hover:text-[#ca002a]">hotro@mykingdom.com.vn</a></li>
              <li className="font-red-hat text-[10px] mb-2 leading-[1.5]">Thứ 2 - Thứ 7 8:00 - 17:00</li>
              <li className="font-red-hat text-[10px] mb-2 leading-[1.5]">Chủ nhật 8:00 - 12:00</li>
            </ul>
          </div>
        </div>
        <div>
          <h4 className="font-tilt-warp text-sm text-[#ca002a] m-0 mb-[15px]">Điều khoản và chính sách</h4>
          <ul className="list-none p-0 m-0">
            <li className="font-red-hat text-[10px] mb-2 leading-[1.5]"><a href="https://www.mykingdom.com.vn/pages/dieu-kien-giao-dich-chung" className="text-black underline hover:text-[#ca002a]">Điều kiện giao dịch chung</a></li>
            <li className="font-red-hat text-[10px] mb-2 leading-[1.5]"><a href="https://www.mykingdom.com.vn/pages/dieu-kien-dieu-khoan-thanh-vien" className="text-black underline hover:text-[#ca002a]">Điều kiện & Điều khoản thành viên</a></li>
            <li className="font-red-hat text-[10px] mb-2 leading-[1.5]"><a href="https://www.mykingdom.com.vn/pages/chinh-sach-giao-hang" className="text-black underline hover:text-[#ca002a]">Chính sách giao hàng</a></li>
            <li className="font-red-hat text-[10px] mb-2 leading-[1.5]"><a href="https://www.mykingdom.com.vn/pages/private-policy" className="text-black underline hover:text-[#ca002a]">Chính sách bảo mật</a></li>
            <li className="font-red-hat text-[10px] mb-2 leading-[1.5]"><a href="https://www.mykingdom.com.vn/pages/exchange-refunds" className="text-black underline hover:text-[#ca002a]">Chính sách bảo hành và đổi trả hàng hóa</a></li>
            <li className="font-red-hat text-[10px] mb-2 leading-[1.5]"><a href="https://www.mykingdom.com.vn/pages/payment" className="text-black underline hover:text-[#ca002a]">Chính sách thanh toán</a></li>
            <li className="font-red-hat text-[10px] mb-2 leading-[1.5]"><a href="https://www.mykingdom.com.vn/pages/chinh-sach-tra-gop" className="text-black underline hover:text-[#ca002a]">Chính sách trả góp</a></li>
            <li className="font-red-hat text-[10px] mb-2 leading-[1.5]"><a href="https://www.mykingdom.com.vn/pages/store-locator" className="text-black underline hover:text-[#ca002a]">Hệ thống cửa hàng</a></li>
          </ul>
        </div>
        <div className="pl-5">
          <h4 className="font-tilt-warp text-sm text-[#ca002a] m-0 mb-[15px]">Follow us</h4>
          <div className="flex gap-[15px] mb-[30px]">
            <img 
              src="https://www.figma.com/api/mcp/asset/9649f4ac-a977-46e2-bcd8-74773ac48c70" 
              alt="Social" 
              className="w-7 h-7 cursor-pointer"
            />
            <img 
              src="https://www.figma.com/api/mcp/asset/7493b9e4-4b31-4cbd-96d2-ae9a6cf887ba" 
              alt="Social" 
              className="w-7 h-7 cursor-pointer"
            />
            <img 
              src="https://www.figma.com/api/mcp/asset/9649f4ac-a977-46e2-bcd8-74773ac48c70" 
              alt="Social" 
              className="w-7 h-7 cursor-pointer"
            />
            <img 
              src="https://www.figma.com/api/mcp/asset/7493b9e4-4b31-4cbd-96d2-ae9a6cf887ba" 
              alt="Social" 
              className="w-7 h-7 cursor-pointer"
            />
            <img 
              src="https://www.figma.com/api/mcp/asset/9649f4ac-a977-46e2-bcd8-74773ac48c70" 
              alt="Social" 
              className="w-7 h-7 cursor-pointer"
            />
          </div>
          <h4 className="font-tilt-warp text-sm text-[#ca002a] m-0 mb-[15px]">Hệ thống cửa hàng</h4>
          <div className="w-[269px] h-[154px] rounded-[25px] overflow-hidden">
            <img 
              src="https://www.figma.com/api/mcp/asset/5d22d290-b7a7-4271-8d67-dd4b5263c2d2" 
              alt="Store" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
