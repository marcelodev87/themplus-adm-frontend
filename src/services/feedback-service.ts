import { api } from 'boot/axios';
import type { Feedback } from 'src/ts/interfaces/models/feedback';

const baseUrl = 'feedbacks';

export const getFeedbacksService = (): Promise<{
  status: number;
  data: {
    feedbacks: Feedback[];
    message: string;
  };
}> => api.get(`${baseUrl}`);

export const getCountFeedbacksService = (): Promise<{
  status: number;
  data: {
    notifications: number;
    message: string;
  };
}> => api.get(`${baseUrl}/notifications`);

export const saveFeedbackService = (
  id: string,
): Promise<{
  status: number;
  data: {
    feedbacks: Feedback[];
    message: string;
  };
}> => api.post(`${baseUrl}/${id}`);

export const getFeedbacksSavedService = (): Promise<{
  status: number;
  data: {
    feedbacks: Feedback[];
    message: string;
  };
}> => api.get(`${baseUrl}/saved`);

export const excludeService = (
  id: string,
): Promise<{
  status: number;
  data: {
    feedbacks: Feedback[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);

export const deleteSavedService = (
  id: string,
): Promise<{
  status: number;
  data: {
    feedbacks: Feedback[];
    message: string;
  };
}> => api.delete(`${baseUrl}/saved/${id}`);
