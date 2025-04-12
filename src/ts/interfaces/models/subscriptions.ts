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
  type: string;
  subscription_id: string | null;
  resource: string | null;
  discount: number;
  date_expiration: string | null;
}
