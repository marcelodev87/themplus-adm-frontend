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
  movements: number,
  allowFinancial: number,
  allowMembers: number,
  allowAssistantWhatsapp: number,
  discount: number | null,
  dateExpires: string | null,
): Promise<{
  status: number;
  data: {
    coupons: CouponTable[];
    message: string;
  };
}> =>
  api.post(`/${baseUrl}`, {
    name,
    movements,
    allowFinancial,
    allowMembers,
    allowAssistantWhatsapp,
    discount,
    dateExpires,
  });

export const updateCouponService = (
  id: string,
  name: string,
  movements: number,
  allowFinancial: number,
  allowMembers: number,
  allowAssistantWhatsapp: number,
  discount: number | null,
  dateExpires: string | null,
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
    movements,
    allowFinancial,
    allowMembers,
    allowAssistantWhatsapp,
    discount,
    dateExpires,
  });

export const deleteCouponService = (
  id: string,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`/${baseUrl}/${id}`);
