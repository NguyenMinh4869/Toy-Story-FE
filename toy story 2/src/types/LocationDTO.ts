export interface Ward {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  province_code: number;
  district_code?: number;
}

export interface District {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  province_code: number;
  wards?: Ward[];
}

export interface Province {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  phone_code: number;
  districts?: District[];
}
