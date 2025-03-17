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
}> => api.get(`/adm/${baseUrl}`);

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
  api.post(`/adm/${baseUrl}`, {
    enterprise,
    user,
  });

export const deleteEnterpriseService = (
  id: string,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`/adm/${baseUrl}/${id}`);
