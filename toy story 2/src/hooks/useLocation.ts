import { Ward, District, Province } from "@/types/LocationDTO";

class LocationService {
  private baseUrl = "https://localhost:7217/api/locations";
  private wardCache = new Map<number, Ward>();
  private districtCache = new Map<number, District>();
  private provinceCache = new Map<number, Province>();

  async getWardByCode(code: number): Promise<Ward | null> {
    if (this.wardCache.has(code)) {
      return this.wardCache.get(code)!;
    }

    try {
      const response = await fetch(`${this.baseUrl}/ward/${code}`);
      if (!response.ok) return null;
      const ward = await response.json();
      this.wardCache.set(code, ward);
      return ward;
    } catch {
      return null;
    }
  }

  async getDistrictByCode(code: number): Promise<District | null> {
    if (this.districtCache.has(code)) {
      return this.districtCache.get(code)!;
    }

    try {
      const response = await fetch(`${this.baseUrl}/district/${code}`);
      if (!response.ok) return null;
      const district = await response.json();
      this.districtCache.set(code, district);
      return district;
    } catch {
      return null;
    }
  }

  async getProvinceByCode(code: number): Promise<Province | null> {
    if (this.provinceCache.has(code)) {
      return this.provinceCache.get(code)!;
    }

    try {
      const response = await fetch(`${this.baseUrl}/province/${code}`);
      if (!response.ok) return null;
      const province = await response.json();
      this.provinceCache.set(code, province);
      return province;
    } catch {
      return null;
    }
  }

  async getAllProvinces(): Promise<Province[]> {
    try {
      const response = await fetch(`${this.baseUrl}/provinces`);
      if (!response.ok) return [];
      return await response.json();
    } catch {
      return [];
    }
  }

  async getFullAddress(wardCode: number): Promise<string> {
    try {
      const ward = await this.getWardByCode(wardCode);
      if (!ward) return "Unknown location";

      const district = await this.getDistrictByCode(ward.district_code!);
      const province = await this.getProvinceByCode(ward.province_code);

      return [ward.name, district?.name, province?.name]
        .filter(Boolean)
        .join(", ");
    } catch {
      return "Unknown location";
    }
  }
}

export const locationService = new LocationService();
