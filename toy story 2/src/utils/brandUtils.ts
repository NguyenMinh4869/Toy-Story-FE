/**
 * Brand Utilities
 * Helper functions for brand data manipulation
 */

import type { ViewBrandDto } from '../types/BrandDTO'

export interface GroupedBrands {
  letter: string
  brands: ViewBrandDto[]
}

/**
 * Groups brands alphabetically by first character
 * Groups A-Z and 0-9 separately, with 0-9 at the end
 * @param brands - Array of brands to group
 * @returns Array of grouped brands sorted alphabetically
 */
export const groupBrandsByLetter = (brands: ViewBrandDto[]): GroupedBrands[] => {
  // Create a map to store brands by their first letter
  const grouped = new Map<string, ViewBrandDto[]>()

  brands.forEach((brand) => {
    const name = brand.name?.trim()
    if (!name) return

    // Get first character and normalize it
    const firstChar = name.charAt(0).toUpperCase()
    
    // Determine the group key
    let groupKey: string
    if (/[A-Z]/.test(firstChar)) {
      groupKey = firstChar
    } else if (/[0-9]/.test(firstChar)) {
      groupKey = '0-9'
    } else {
      groupKey = '#' // For special characters
    }

    // Add brand to the appropriate group
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, [])
    }
    grouped.get(groupKey)!.push(brand)
  })

  // Sort brands within each group by name
  grouped.forEach((brands) => {
    brands.sort((a, b) => {
      const nameA = a.name?.toLowerCase() ?? ''
      const nameB = b.name?.toLowerCase() ?? ''
      return nameA.localeCompare(nameB)
    })
  })

  // Convert map to array and sort
  const result: GroupedBrands[] = Array.from(grouped.entries()).map(([letter, brands]) => ({
    letter,
    brands,
  }))

  // Sort: A-Z first, then 0-9, then special characters
  result.sort((a, b) => {
    const letterA = a.letter
    const letterB = b.letter

    // Handle 0-9 group
    if (letterA === '0-9' && letterB !== '0-9') return 1
    if (letterA !== '0-9' && letterB === '0-9') return -1

    // Handle special characters
    if (letterA === '#' && letterB !== '#') return 1
    if (letterA !== '#' && letterB === '#') return -1

    // Normal alphabetical sort
    return letterA.localeCompare(letterB)
  })

  return result
}

/**
 * Gets all available letter groups from brands
 * Used for the filter navigation
 */
export const getAvailableLetters = (groupedBrands: GroupedBrands[]): string[] => {
  return groupedBrands.map((group) => group.letter)
}
