// import { AxiosError } from 'axios';
import { api } from 'boot/axios';
// import { Notify } from 'quasar';
import type { UserADM } from 'src/ts/interfaces/models/user';

const baseUrl = 'member';

// const createError = (error: any) => {
//   let message = 'Error';
//   if (error instanceof AxiosError) {
//     message = error.response?.data?.message;
//   } else if (error instanceof Error) {
//     message = error.message;
//   }
//   Notify.create({
//     message,
//     type: 'negative',
//   });
// };

export const getUsersMembersService = (): Promise<{
  status: number;
  data: {
    users: UserADM[];
  };
}> => api.get(`${baseUrl}`);

// export const getInboxService = (): Promise<{
//   status: number;
//   data: {
//     inbox: Inbox[];
//   };
// }> => api.get(`${baseUrl}/inbox`);

// export const readNotificationService = (
//   id: string,
// ): Promise<{
//   status: number;
//   data: {
//     inbox: Inbox[];
//     message: string;
//   };
// }> => api.put(`${baseUrl}/inbox`, { id });

// export const readAllNotificationService = (): Promise<{
//   status: number;
//   data: {
//     inbox: Inbox[];
//     message: string;
//   };
// }> => api.put(`${baseUrl}/inbox-all`);

// export const findUserService = (
//   userId: string,
// ): Promise<{
//   status: number;
//   data: {
//     user: User;
//   };
// }> => api.get(`${baseUrl}/find/${userId}`);

// export const getUsersMembersByEnterpriseService = (
//   enterpriseId: string,
// ): Promise<{
//   status: number;
//   data: {
//     users: User[];
//     settings: SettingsCounter;
//   };
// }> => api.get(`${baseUrl}/${enterpriseId}`);

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

// export const createUserMemberOfficeService = (
//   payload: DataUserMember3,
// ): Promise<{
//   status: number;
//   data: {
//     offices: Office[];
//     message: string;
//   };
// }> => api.post(`${baseUrl}/start-office`, payload);

// export const createUserMemberByCounterService = (
//   payload: CreateUserByCounter,
// ): Promise<{
//   status: number;
//   data: {
//     users: User[];
//     settings: SettingsCounter;
//     message: string;
//   };
// }> => api.post(`${baseUrl}/member-counter`, payload);

// export const exportUserService = async () => {
//   try {
//     const response = await api.post(`${baseUrl}/export`, null, {
//       responseType: 'blob',
//     });
//     const now = new Date();
//     const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');

//     const url2 = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement('a');
//     link.href = url2;
//     link.setAttribute('download', `usuarios_${timestamp}.xlsx`);
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   } catch (error) {
//     createError(error);
//   }
// };

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

// export const updateUserMemberByCounter = (
//   id: string,
//   name: string,
//   email: string,
//   phone: string | null,
// ): Promise<{
//   status: number;
//   data: {
//     users: User[];
//     settings: SettingsCounter;
//     message: string;
//   };
// }> =>
//   api.put(`${baseUrl}/member-counter`, {
//     id,
//     name,
//     email,
//     phone,
//   });

// export const updateActiveUserService = (
//   active: number,
//   userId: string,
// ): Promise<{
//   status: number;
//   data: {
//     users: User[];
//     message: string;
//   };
// }> => api.put(`${baseUrl}/active/`, { active, userId });
// export const deleteUserMemberService = (
//   id: string,
// ): Promise<{
//   status: number;
//   data: {
//     message: string;
//   };
// }> => api.delete(`${baseUrl}/${id}`);

// export const deleteNotificationService = (
//   id: string,
// ): Promise<{
//   status: number;
//   data: {
//     message: string;
//   };
// }> => api.delete(`${baseUrl}/inbox/${id}`);

// export const deleteUserMemberByEnterpriseService = (
//   id: string,
// ): Promise<{
//   status: number;
//   data: {
//     message: string;
//   };
// }> => api.delete(`${baseUrl}/${id}/counter`);
