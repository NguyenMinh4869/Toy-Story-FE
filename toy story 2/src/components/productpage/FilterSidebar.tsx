import React, { useState } from 'react'

// Filter option types
interface FilterOption {
  id: string
  label: string
  count: number
}

interface FilterSidebarProps {
  onCategoryChange?: (categories: string[]) => void
  onPriceChange?: (priceRanges: string[]) => void
  onAgeChange?: (ageRanges: string[]) => void
  onBrandChange?: (brands: string[]) => void
}

// Category menu items
const categoryItems = [
  'Tổng quan về Toy Story',
  'Dạy con ngoan hiền',
  'Chơi cùng con',
  'Nuôi con khỏe',
  'Mẹo hữu ích',
  'Hôm nay cho con ăn gì ?',
  'Vòng quanh thanh hóa',
]

// Price range options
const priceRanges: FilterOption[] = [
  { id: 'under-200k', label: 'Dưới 200.000 Đ', count: 0 },
  { id: '200k-500k', label: '200.000 Đ - 500.000 Đ', count: 10 },
  { id: '500k-1m', label: '500.000 Đ - 1.000.000 Đ', count: 10 },
  { id: '1m-2m', label: '1.000.000 Đ - 2.000.000 Đ', count: 10 },
  { id: 'above-2m', label: 'Trên 2.000.000', count: 10 },
]

// Age range options
const ageRanges: FilterOption[] = [
  { id: '12-plus', label: '12 tuổi trở lên', count: 0 },
  { id: '6-12', label: '6 - 12 tuổi', count: 10 },
  { id: '3-6', label: '3 - 6 tuổi', count: 10 },
  { id: '1-3', label: '1 - 3 tuổi', count: 10 },
  { id: '0-12-months', label: '0 - 12 tháng', count: 20 },
]

// Brand options
const brandOptions: FilterOption[] = [
  { id: 'lego-art', label: 'LEGO ART', count: 0 },
  { id: 'lego-ninja', label: 'LEGO NINJA', count: 10 },
  { id: 'lego-hay', label: 'LEGO HAY', count: 10 },
  { id: 'lego-nike', label: 'LEGO NIKE', count: 10 },
  { id: 'lego-addidas', label: 'LEGO ADDIDDAS', count: 10 },
]

// Checkbox component
const FilterCheckbox: React.FC<{
  id: string
  label: string
  count: number
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}> = ({ id, label, count, checked, onChange, disabled = false }) => (
  <label 
    className={`flex items-center gap-3 cursor-pointer py-1 ${disabled ? 'opacity-50' : ''}`}
    htmlFor={id}
  >
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      className="w-[12px] h-[11px] rounded border border-black/80 accent-[#ab0007] cursor-pointer"
    />
    <span className={`font-red-hat font-bold text-[12px] ${disabled || count === 0 ? 'text-[#d9d9d9]' : 'text-[#030202]'}`}>
      {label}
    </span>
    <span className={`font-sansation font-bold text-[12px] ml-auto ${count === 0 ? 'text-[#d9d9d9]' : 'text-black'}`}>
      ({count})
    </span>
  </label>
)

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onCategoryChange,
  onPriceChange,
  onAgeChange,
  onBrandChange,
}) => {
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedAges, setSelectedAges] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  const handlePriceChange = (id: string, checked: boolean) => {
    const newSelection = checked 
      ? [...selectedPrices, id]
      : selectedPrices.filter(p => p !== id)
    setSelectedPrices(newSelection)
    onPriceChange?.(newSelection)
  }

  const handleAgeChange = (id: string, checked: boolean) => {
    const newSelection = checked 
      ? [...selectedAges, id]
      : selectedAges.filter(a => a !== id)
    setSelectedAges(newSelection)
    onAgeChange?.(newSelection)
  }

  const handleBrandChange = (id: string, checked: boolean) => {
    const newSelection = checked 
      ? [...selectedBrands, id]
      : selectedBrands.filter(b => b !== id)
    setSelectedBrands(newSelection)
    onBrandChange?.(newSelection)
  }

  return (
    <aside className="w-[320px] flex-shrink-0">
      {/* Category Section */}
      <section className="mb-6">
        <h2 className="font-sansation font-bold text-[12px] text-[#ab0007] mb-4">
          DANH MỤC
        </h2>
        <nav className="flex flex-col">
          {categoryItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="font-sansation text-[12px] text-black py-2 border-b border-gray-200 hover:text-[#ab0007] transition-colors no-underline"
            >
              {item}
            </a>
          ))}
        </nav>
      </section>

      {/* Price Filter Section */}
      <section className="mb-6">
        <h2 className="font-sansation font-bold text-[12px] text-[#ab0007] mb-4">
          Giá (VND)
        </h2>
        <div className="flex flex-col gap-1">
          {priceRanges.map((option) => (
            <FilterCheckbox
              key={option.id}
              id={`price-${option.id}`}
              label={option.label}
              count={option.count}
              checked={selectedPrices.includes(option.id)}
              onChange={(checked) => handlePriceChange(option.id, checked)}
              disabled={option.count === 0}
            />
          ))}
        </div>
      </section>

      {/* Age Filter Section */}
      <section className="mb-6">
        <h2 className="font-sansation font-bold text-[12px] text-[#ab0007] mb-4">
          Tuổi
        </h2>
        <div className="flex flex-col gap-1">
          {ageRanges.map((option) => (
            <FilterCheckbox
              key={option.id}
              id={`age-${option.id}`}
              label={option.label}
              count={option.count}
              checked={selectedAges.includes(option.id)}
              onChange={(checked) => handleAgeChange(option.id, checked)}
              disabled={option.count === 0}
            />
          ))}
        </div>
      </section>

      {/* Brand Filter Section */}
      <section className="mb-6">
        <h2 className="font-sansation font-bold text-[12px] text-[#ab0007] mb-4">
          Thương Hiệu
        </h2>
        <div className="flex flex-col gap-1">
          {brandOptions.map((option) => (
            <FilterCheckbox
              key={option.id}
              id={`brand-${option.id}`}
              label={option.label}
              count={option.count}
              checked={selectedBrands.includes(option.id)}
              onChange={(checked) => handleBrandChange(option.id, checked)}
              disabled={option.count === 0}
            />
          ))}
        </div>
      </section>
    </aside>
  )
}

export default FilterSidebar
