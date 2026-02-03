/**
 * Vietnam Location Service
 * Fetch provinces, districts, wards from public API
 */

import type { Province, District } from '../types/Location'

const VIETNAM_API_URL = 'https://provinces.open-api.vn/api'

/**
 * Fetch all provinces with full district and ward data
 */
export const fetchProvinces = async (): Promise<Province[]> => {
  try {
    const response = await fetch(`${VIETNAM_API_URL}/p/`)
    if (!response.ok) {
      throw new Error('Failed to fetch provinces')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching provinces:', error)
    return []
  }
}

/**
 * Fetch province with districts and wards
 */
export const fetchProvinceWithDetails = async (provinceCode: number): Promise<Province | null> => {
  try {
    const response = await fetch(`${VIETNAM_API_URL}/p/${provinceCode}?depth=3`)
    if (!response.ok) {
      throw new Error('Failed to fetch province details')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching province details:', error)
    return null
  }
}

/**
 * Fetch district with wards
 */
export const fetchDistrictWithWards = async (districtCode: number): Promise<District | null> => {
  try {
    const response = await fetch(`${VIETNAM_API_URL}/d/${districtCode}?depth=2`)
    if (!response.ok) {
      throw new Error('Failed to fetch district details')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching district details:', error)
    return null
  }
}
