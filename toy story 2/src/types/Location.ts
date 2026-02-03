/**
 * Vietnam Location Types
 * Types for province, district, ward data structure
 */

export interface Ward {
  code: number
  name: string
  codename: string
  division_type: string
  short_codename: string
}

export interface District {
  code: number
  name: string
  codename: string
  division_type: string
  short_codename: string
  wards: Ward[]
}

export interface Province {
  code: number
  name: string
  codename: string
  division_type: string
  phone_code: number
  districts: District[]
}

export interface AddressFormData {
  recipientName: string
  province: string
  district: string
  ward: string
  specificAddress: string
}
