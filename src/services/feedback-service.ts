import { api } from 'boot/axios';
import type { Feedback } from 'src/ts/interfaces/models/feedback';

const baseUrl = 'feedbacks';

export const getFeedbacks = (): Promise<{
  status: number;
  data: {
    feedbacks: Feedback[];
    message: string;
  };
}> => api.get(`${baseUrl}`);

export const getNotificationsFeedback = (): Promise<{
  status: number;
  data: {
    notifications: number;
    message: string;
  };
}> => api.get(`${baseUrl}/notifications`);

export const saveFeedback = (
  id: string,
): Promise<{
  status: number;
  data: {
    feedbacks: Feedback[];
    message: string;
  };
}> => api.post(`${baseUrl}/${id}`);

export const getFeedbacksSaved = (): Promise<{
  status: number;
  data: {
    feedbacks: Feedback[];
    message: string;
  };
}> => api.get(`${baseUrl}/saved`);

export const exclude = (
  id: string,
): Promise<{
  status: number;
  data: {
    feedbacks: Feedback[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);

export const deleteSaved = (
  id: string,
): Promise<{
  status: number;
  data: {
    feedbacks: Feedback[];
    message: string;
  };
}> => api.delete(`${baseUrl}/saved/${id}`);
