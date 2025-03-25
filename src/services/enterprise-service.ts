import { api } from 'boot/axios';
import type { Enterprise, EnterpriseCreate } from 'src/ts/interfaces/models/enterprise';
import type { UserCeate } from 'src/ts/interfaces/models/user';

const baseUrl = 'enterprise';

export const getEnterprisesService = (): Promise<{
  status: number;
  data: {
    enterprises: Enterprise[];
    message: string;
  };
}> => api.get(`/${baseUrl}`);

export const createEnterpriseByAdmService = (
  enterprise: EnterpriseCreate,
  user: UserCeate,
): Promise<{
  status: number;
  data: {
    enterprises: Enterprise[];
    message: string;
  };
}> =>
  api.post(`/${baseUrl}`, {
    enterprise,
    user,
  });

export const setCouponService = (
  enterpriseId: string, couponId: string | null
): Promise<{
  status: number;
  data: {
    enterprises: Enterprise[];
    message: string;
  };
}> =>
  api.put(`/${baseUrl}/coupon`, {
    enterpriseId,
    couponId,
  });

export const deleteEnterpriseService = (
  id: string,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`/${baseUrl}/${id}`);
