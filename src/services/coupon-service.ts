import { api } from 'boot/axios';
import type { CouponTable } from 'src/ts/interfaces/models/subscriptions';

const baseUrl = 'coupon';

export const getCouponsService = (): Promise<{
  status: number;
  data: {
    coupons: CouponTable[];
    message: string;
  };
}> => api.get(`adm/${baseUrl}`);

export const deleteCouponService = (
  id: string,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`adm/${baseUrl}/${id}`);
