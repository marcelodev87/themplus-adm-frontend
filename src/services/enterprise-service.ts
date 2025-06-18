import { api } from 'boot/axios';
import type {
  Enterprise,
  EnterpriseCreate,
  EnterpriseSelect,
} from 'src/ts/interfaces/models/enterprise';
import type { CouponEnterprise } from 'src/ts/interfaces/models/subscriptions';
import type { UserCeate } from 'src/ts/interfaces/models/user';

const baseUrl = 'enterprise';

export const getEnterprisesService = (): Promise<{
  status: number;
  data: {
    enterprises: Enterprise[];
    message: string;
  };
}> => api.get(`/${baseUrl}`);

export const getSelectEnterprisesService = (): Promise<{
  status: number;
  data: {
    enterprises: EnterpriseSelect[];
    message: string;
  };
}> => api.get(`/${baseUrl}/list-select`);

export const getCouponsInEnterpriseService = (
  entepriseId: string,
): Promise<{
  status: number;
  data: {
    coupons: CouponEnterprise[];
  };
}> => api.get(`/${baseUrl}/${entepriseId}/coupons`);

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

export const updateEnterpriseByAdmService = (payload: {
  id: string;
  name: string;
  cnpj: string | null;
  cpf: string | null;
  cep: string | null;
  state: string | null;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  complement: string | null;
  number_address: string | null;
  email: string | null;
  phone: string | null;
}): Promise<{
  status: number;
  data: {
    enterprises: Enterprise[];
    message: string;
  };
}> => api.put(`${baseUrl}/`, payload);

export const setCouponService = (
  enterpriseId: string,
  couponId: string | null,
): Promise<{
  status: number;
  data: {
    enterprises: Enterprise[];
    message: string;
  };
}> =>
  api.post(`/${baseUrl}/coupon`, {
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

export const removeCouponEnterpriseService = (
  couponId: string,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`/${baseUrl}/${couponId}/coupon`);
