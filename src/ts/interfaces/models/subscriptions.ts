export interface Coupon {
  id: string;
  name: string;
}

export interface CouponTable {
  id: string;
  name: string;
  using: number;
  created_at: string;
}

export interface CouponData {
  id: string;
  name: string;
  movements: number;
  allow_financial: number;
  allow_members: number;
  allow_assistant_whatsapp: number;
  new_price: number | null;
  date_expires: string | null;
  created_at: string;
}
