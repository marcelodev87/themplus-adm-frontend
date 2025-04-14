import { api } from 'boot/axios';
import type { CouponTable, CouponData } from 'src/ts/interfaces/models/subscriptions';

const baseUrl = 'coupon';

export const getCouponsService = (): Promise<{
  status: number;
  data: {
    coupons: CouponTable[];
    message: string;
  };
}> => api.get(`/${baseUrl}`);

export const getCouponService = (
  id: string,
): Promise<{
  status: number;
  data: {
    coupon: CouponData;
  };
}> => api.get(`/${baseUrl}/${id}`);

export const createCouponService = (
  name: string,
  type: string,
  subscription: string | null,
  service: string | null,
  discount: number | null,
  dateExpiration: string | null,
  limit: number | null,
  description: string | null,
): Promise<{
  status: number;
  data: {
    coupons: CouponTable[];
    message: string;
  };
}> =>
  api.post(`/${baseUrl}`, {
    name,
    type,
    service,
    subscription,
    discount,
    dateExpiration,
    limit,
    description,
  });

export const updateCouponService = (
  id: string,
  name: string,
  type: string,
  subscription: string | null,
  resource: string | null,
  discount: number | null,
  dateExpiration: string | null,
  limit: number | null,
  description: string | null,
): Promise<{
  status: number;
  data: {
    coupons: CouponTable[];
    message: string;
  };
}> =>
  api.put(`/${baseUrl}`, {
    id,
    name,
    type,
    subscription,
    resource,
    discount,
    dateExpiration,
    limit,
    description,
  });

export const deleteCouponService = (
  id: string,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`/${baseUrl}/${id}`);
