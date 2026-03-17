import React, { useState, useEffect } from "react";
import { getActiveBrands } from "../../services/brandService";
import { getCategories } from "../../services/categoryService";
import type { ViewCategoryDto } from "../../types/CategoryDTO";

// Filter option types
interface FilterOption {
  id: string;
  label: string;
}

interface FilterSidebarProps {
  onCategoryChange?: (categories: string[]) => void;
  onPriceChange?: (priceRanges: string[]) => void;
  onAgeChange?: (ageRanges: string[]) => void;
  onBrandChange?: (brands: string[]) => void;
}

// Price range options

const priceRanges: FilterOption[] = [
  { id: "under-200k", label: "Dưới 200.000 Đ" },
  { id: "200k-500k", label: "200.000 Đ - 500.000 Đ" },
  { id: "500k-1m", label: "500.000 Đ - 1.000.000 Đ" },
  { id: "1m-2m", label: "1.000.000 Đ - 2.000.000 Đ" },
  { id: "above-2m", label: "Trên 2.000.000" },
];

// Age range options
const ageRanges: FilterOption[] = [
  { id: "12-plus", label: "12 tuổi trở lên" },
  { id: "6-12", label: "6 - 12 tuổi" },
  { id: "3-6", label: "3 - 6 tuổi" },
  { id: "1-3", label: "1 - 3 tuổi" },
  { id: "0-12-months", label: "0 - 12 tháng" },
];

// Brand options (fallback if API fails)
const initialBrandOptions: FilterOption[] = [
  { id: "1", label: "LEGO ART" },
  { id: "2", label: "LEGO NINJA" },
  { id: "3", label: "LEGO HAY" },
  { id: "4", label: "LEGO NIKE" },
  { id: "5", label: "LEGO ADDIDDAS" },
];

// Checkbox component
interface FilterCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const FilterCheckbox = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
}: FilterCheckboxProps) => (
  <label
    className={`flex items-center gap-3 cursor-pointer py-1 group ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    htmlFor={id}
    onClick={(e) => {
      e.preventDefault();
      onChange(!checked);
    }}
  >
    {/* Custom Checkbox */}
    <div
      className={`w-[14px] h-[14px] rounded border flex items-center justify-center transition-all duration-200 ${
        checked
          ? "bg-[#ab0007] border-[#ab0007]"
          : "bg-white border-black/30 group-hover:border-[#ab0007]"
      }`}
    >
      {checked && (
        <svg
          width="8"
          height="6"
          viewBox="0 0 10 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 4.5L3.5 7L9 1"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>

    <span
      className={`font-red-hat font-bold text-[12px] transition-colors text-[#888] ${
        checked ? "text-[#ab0007]" : ""
      }`}
    >
      {label}
    </span>
  </label>
);

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onCategoryChange,
  onPriceChange,
  onAgeChange,
  onBrandChange,
}) => {
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brands, setBrands] = useState<FilterOption[]>(initialBrandOptions);
  const [categories, setCategories] = useState<ViewCategoryDto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Brands
        const activeBrands = await getActiveBrands();
        if (activeBrands && activeBrands.length > 0) {
          const dynamicBrands = activeBrands.map((b) => ({
            id: String(b.brandId),
            label: b.name || "",
            count: 10,
          }));
          setBrands(dynamicBrands);
        }

        // Fetch Categories
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
      }
    };
    fetchData();
  }, []);

  const handlePriceChange = (id: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedPrices, id]
      : selectedPrices.filter((p) => p !== id);
    setSelectedPrices(newSelection);
    onPriceChange?.(newSelection);
  };

  const handleAgeChange = (id: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedAges, id]
      : selectedAges.filter((a) => a !== id);
    setSelectedAges(newSelection);
    onAgeChange?.(newSelection);
  };

  const handleBrandChange = (id: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedBrands, id]
      : selectedBrands.filter((b) => b !== id);
    setSelectedBrands(newSelection);
    onBrandChange?.(newSelection);
  };

  return (
    <aside className="w-[320px] flex-shrink-0">
      {/* Category Section */}
      <section className="mb-6">
        <h2 className="font-sansation font-bold text-[12px] text-[#ab0007] mb-4">
          DANH MỤC
        </h2>
        <nav className="flex flex-col">
          {categories.map((category) => (
            <a
              key={category.categoryId}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onCategoryChange?.([String(category.categoryId)]);
              }}
              className="font-sansation text-[12px] text-black py-2 border-b border-gray-200 hover:text-[#ab0007] transition-colors no-underline"
            >
              {category.name}
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
              checked={selectedPrices.includes(option.id)}
              onChange={(checked) => handlePriceChange(option.id, checked)}
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
              checked={selectedAges.includes(option.id)}
              onChange={(checked) => handleAgeChange(option.id, checked)}
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
          {brands.map((option) => (
            <FilterCheckbox
              key={option.id}
              id={`brand-${option.id}`}
              label={option.label}
              checked={selectedBrands.includes(option.id)}
              onChange={(checked) => handleBrandChange(option.id, checked)}
            />
          ))}
        </div>
      </section>
    </aside>
  );
};

export default FilterSidebar;
