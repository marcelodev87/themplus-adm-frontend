export interface Coupon {
  id: string;
  name: string;
}

export interface CouponTable {
  id: string;
  name: string;
  type: string;
  using: number;
  date_expiration: string;
  created_at: string;
}

export interface CouponData {
  id: string;
  name: string;
  type: string;
  subscription_id: string | null;
  service: string | null;
  discount: number;
  date_expiration: string | null;
}

export interface Subscription {
  id: string
  enterprises_using: number
  name: string
  price: number
}