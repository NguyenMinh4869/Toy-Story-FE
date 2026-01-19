import React from 'react'
import { Link } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="bg-[#f2f2f2] border-b border-black/20 h-[36px] w-full flex items-center px-[58px]">
      <nav className="flex items-center gap-2 font-red-hat text-[10px]">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-[#484848] mx-1">&gt;</span>}
            {item.href ? (
              <Link 
                to={item.href} 
                className="text-[#484848] hover:text-black transition-colors no-underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-black font-medium">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  )
}

export default Breadcrumb
