import React from 'react'

const highlights = [
  'Miễn phí giao hàng đơn từ 200k',
  'Đổi trả trong 7 ngày tại cửa hàng',
  'Ưu đãi thành viên Toy Story Rewards',
]

const policyLinks = [
  { label: 'Điều kiện giao dịch chung', href: '' },
  { label: 'Điều kiện & Điều khoản thành viên', href: '' },
  { label: 'Chính sách giao hàng', href: '' },
  { label: 'Chính sách bảo mật', href: '' },
  { label: 'Chính sách bảo hành & đổi trả', href: '' },
  { label: 'Chính sách thanh toán', href: '' },
  { label: 'Chính sách trả góp', href: '' },
  { label: 'Hệ thống cửa hàng', href: '' },
]

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' },
  { label: 'Instagram', href: 'https://www.instagram.com', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/240px-Instagram_icon.png' },
  { label: 'YouTube', href: 'https://www.youtube.com', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png' },
  { label: 'TikTok', href: 'https://www.tiktok.com', icon: 'https://img.freepik.com/premium-photo/tiktok-logo_1080029-103.jpg?semt=ais_hybrid&w=740&q=80' },
  { label: 'Zalo', href: 'https://zalo.me', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/240px-Icon_of_Zalo.svg.png' },
]

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

      <div className="bg-[#af0000] min-h-[28px] flex justify-center items-center px-6 text-[12px] font-rowdies uppercase tracking-wide max-xl:text-[11px]">
        <div className="flex flex-wrap justify-center gap-5 text-white">
          {highlights.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <img
                src="https://www.figma.com/api/mcp/asset/6849fe38-3f44-43c3-91d6-a32c6ff0279d"
                alt="Icon"
                className="w-[15px] h-[11px]"
              />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white w-full">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-6 md:py-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-black">
          <div>
            <div className="mb-4">
              <img
                src="https://www.figma.com/api/mcp/asset/a3292b82-feb6-483d-a4f2-619ec8b796dd"
                alt="Logo"
                className="h-[52px] w-auto"
              />
            </div>
            <p className="font-tilt-neon text-[12px] text-black m-0 mb-3 leading-[1.5]">
              Nhận thông tin ưu đãi, quà tặng và bản tin Toy Story sớm nhất!
            </p>
            <div className="flex gap-3 mb-6 pb-4 border-b border-black/10 flex-wrap">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 min-w-[220px] border border-black/20 rounded-lg py-[10px] px-[12px] font-thasadith text-[12px] outline-none focus:border-[#ca002a] transition"
              />
              <button className="bg-[#ca002a] text-white font-tilt-warp text-[12px] py-[10px] px-[18px] rounded-lg cursor-pointer hover:bg-[#e00032] transition">
                Đăng ký
              </button>
            </div>
            <div className="space-y-2">
              <h4 className="font-tilt-warp text-base text-[#ca002a] m-0">Thông tin liên hệ</h4>
              <ul className="list-none p-0 m-0 space-y-[6px]">
                <li className="font-red-hat text-[12px] leading-[1.7]">
                  33-35 Đường Ngô Thị Bì, Khu Đô Thị Mới Him Lam, Phường Tân Hưng, TP.Hồ Chí Minh
                </li>
                <li className="font-red-hat text-[12px] leading-[1.7]">
                  <a href="tel:19001208" className="text-black underline hover:text-[#ca002a]">19001208</a>
                </li>
                <li className="font-red-hat text-[12px] leading-[1.7]">
                  <a href="mailto:hotro@mykingdom.com.vn" className="text-black underline hover:text-[#ca002a]">hotro@mykingdom.com.vn</a>
                </li>
                <li className="font-red-hat text-[12px] leading-[1.7]">Thứ 2 - Thứ 7: 08:00 - 17:00</li>
                <li className="font-red-hat text-[12px] leading-[1.7]">Chủ nhật: 08:00 - 12:00</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-tilt-warp text-base text-[#ca002a] m-0 mb-[15px]">Điều khoản và chính sách</h4>
            <ul className="list-none p-0 m-0 grid grid-cols-1 gap-2">
              {policyLinks.map(({ label, href }) => (
                <li key={label} className="font-red-hat text-[12px] leading-[1.7]">
                  <a href={href} className="text-black underline hover:text-[#ca002a]" target="_blank" rel="noreferrer">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="pl-0 md:pl-5">
            <h4 className="font-tilt-warp text-base text-[#ca002a] m-0 mb-[15px]">Follow us</h4>
            <div className="flex flex-wrap gap-[14px] mb-[24px]">
              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-white shadow-sm hover:scale-105 transition"
                  aria-label={label}
                >
                  <img src={icon} alt={label} className="max-w-[22px] max-h-[22px] object-contain" />
                </a>
              ))}
            </div>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h4 className="font-tilt-warp text-base text-[#ca002a] m-0 mb-[10px]">Hệ thống cửa hàng</h4>
                <a
                  href="https://www.mykingdom.com.vn/pages/store-locator"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block bg-[#ca002a] text-white font-tilt-warp text-[12px] py-[9px] px-[16px] rounded-lg hover:bg-[#e00032] transition"
                >
                  Xem danh sách cửa hàng
                </a>
              </div>
              <div className="w-[269px] h-[154px] rounded-[20px] overflow-hidden shadow-md max-sm:w-full">
                <img
                  src="https://www.figma.com/api/mcp/asset/5d22d290-b7a7-4271-8d67-dd4b5263c2d2"
                  alt="Store"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#930005] text-center text-[12px] py-3 font-red-hat">
        © {new Date().getFullYear()} Toy Story. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
