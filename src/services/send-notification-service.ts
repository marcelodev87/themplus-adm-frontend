import { api } from 'boot/axios';

const baseUrl = 'send-notification';

export const sendNotificationService = (data: {
  title: string;
  text: string;
  enterprisesId: string[];
}): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.post(`/${baseUrl}/`, data);
