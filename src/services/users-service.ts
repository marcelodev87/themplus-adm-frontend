import { api } from 'boot/axios';
import type { User, UserADM } from 'src/ts/interfaces/models/user';

const baseUrl = 'member';

export const getUsersMembersService = (): Promise<{
  status: number;
  data: {
    users: UserADM[];
  };
}> => api.get(`${baseUrl}`);

export const findUserService = (
  userId: string,
): Promise<{
  status: number;
  data: {
    user: UserADM;
  };
}> => api.get(`${baseUrl}/find/${userId}`);

export const createUserMemberService = (
  name: string,
  position: string,
  email: string,
  password: string,
  department: string | null,
): Promise<{
  status: number;
  data: {
    users: UserADM[];
    message: string;
  };
}> =>
  api.post(`${baseUrl}/`, {
    name,
    position,
    email,
    password,
    department,
  });

export const updateUserMemberService = (
  id: string,
  name: string,
  position: string,
  email: string,
  department: string | null,
): Promise<{
  status: number;
  data: {
    users: UserADM[];
    message: string;
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    name,
    email,
    position,
    department,
  });

export const updateEnterpriseMemberService = (
  id: string | null,
  name: string,
  email: string,
  phone: string | null,
): Promise<{
  status: number;
  data: {
    members: User[];
    message: string;
  };
}> =>
  api.put(`${baseUrl}/by-adm`, {
    id,
    name,
    email,
    phone,
  });

export const updateActiveUserService = (
  active: number,
  userId: string,
): Promise<{
  status: number;
  data: {
    users: UserADM[];
    message: string;
  };
}> => api.put(`${baseUrl}/active/`, { active, userId });
export const deleteUserMemberService = (
  id: string,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);

export const deleteUserMemberByEnterpriseService = (
  id: string,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}/counter`);
