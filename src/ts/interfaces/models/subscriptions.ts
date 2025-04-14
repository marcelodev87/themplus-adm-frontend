export interface Coupon {
  id: string;
  name: string;
}

export interface CouponTable {
  id: string;
  name: string;
  type: string;
  active: number;
  using: number;
  limit: number | null;
  date_expiration: string;
  created_at: string;
}

export interface CouponData {
  id: string;
  name: string;
  description: string;
  type: string;
  limit: number;
  subscription_id: string | null;
  service_id: string | null;
  discount: number;
  date_expiration: string | null;
}

export interface Subscription {
  id: string;
  enterprises_using: number;
  name: string;
  price: number;
}
