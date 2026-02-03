/**
 * Profile Layout
 * Left sidebar navigation + right content area for user profile pages
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { User, ShoppingBag, Heart, Lock } from 'lucide-react'

interface ProfileLayoutProps {
  children: React.ReactNode
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  const location = useLocation()

  const menuItems = [
    {
      path: '/profile',
      label: 'Tài khoản',
      icon: User,
      exact: true
    },
    {
      path: '/profile/orders',
      label: 'Lịch sử mua hàng',
      icon: ShoppingBag
    },
    {
      path: '/profile/wishlist',
      label: 'Danh sách yêu thích',
      icon: Heart
    },
    {
      path: '/profile/change-password',
      label: 'Đổi mật khẩu',
      icon: Lock
    }
  ]

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="bg-gray-50">
      <main className="max-w-[1800px] mx-auto px-[38px] py-8 w-full">
        <h1 className="text-[#00247d] text-[32px] font-bold text-center mb-8 font-tilt-warp">
          Tài Khoản Của Bạn
        </h1>
        
        <div className="flex gap-6 items-start">
          {/* Left Sidebar */}
          <aside className="w-[330px] flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Sidebar Header */}
              <div className="bg-[#ab0007] text-white py-4 px-6">
                <h2 className="font-tilt-warp text-base font-bold">Tài Khoản Của Bạn</h2>
              </div>
              
              {/* Menu Items */}
              <nav className="p-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.path, item.exact)
                    
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors no-underline ${
                            active
                              ? 'bg-red-50 text-[#ab0007] font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon size={20} className="flex-shrink-0" />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      </li>
                    )
                  })}

                </ul>
              </nav>
            </div>
          </aside>
          
          {/* Right Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfileLayout
