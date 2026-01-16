import { Link } from 'react-router-dom'
import './Header.css'

const Header = () => {
  const handleImageError = (e) => {
    e.target.style.display = 'none'
  }

  return (
    <header className="header">
      <div className="header-top">
        <Link to="/" className="header-logo">
          <img 
            src="https://www.figma.com/api/mcp/asset/a3292b82-feb6-483d-a4f2-619ec8b796dd" 
            alt="Logo" 
            onError={handleImageError}
          />
          <div className="logo-placeholder">TOYSTORY</div>
        </Link>
        <div className="header-search">
          <div className="search-box">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="rgba(0,0,0,0.41)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 19L14.65 14.65" stroke="rgba(0,0,0,0.41)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input type="text" placeholder="Nhập đồ chơi bạn muốn" />
          </div>
        </div>
        <div className="header-actions">
          <Link to="/login" className="header-action-item">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="7" r="4" stroke="white" strokeWidth="2"/>
              <path d="M3 21C3 16 6.5 13 11 13C15.5 13 19 16 19 21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Đăng nhập</span>
          </Link>
          <div className="header-action-item">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M7 7H5C3.89543 7 3 7.89543 3 9V19C3 20.1046 3.89543 21 5 21H17C18.1046 21 19 20.1046 19 19V9C19 7.89543 18.1046 7 17 7H15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7 7V5C7 2.79086 8.79086 1 11 1C13.2091 1 15 2.79086 15 5V7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Giỏ hàng</span>
          </div>
        </div>
      </div>
      <nav className="header-nav">
        <a href="#exclusive">ĐỘC QUYỀN ONLINE</a>
        <a href="#gundam" className="has-dropdown">
          GUNDAM
          <svg width="17" height="8" viewBox="0 0 17 8" fill="none">
            <path d="M1 1L8.5 7L16 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </a>
        <a href="#new">HÀNG MỚI</a>
        <a href="#products" className="has-dropdown">
          SẢN PHẨM
          <svg width="17" height="8" viewBox="0 0 17 8" fill="none">
            <path d="M1 1L8.5 7L16 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </a>
        <a href="#promotion">KHUYẾN MÃI</a>
        <a href="#brands">THƯƠNG HIỆU</a>
        <a href="#guide">CẨM NANG MUA HÀNG</a>
      </nav>
    </header>
  )
}

export default Header
