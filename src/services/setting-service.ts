import { api } from 'src/boot/axios';
import type { AllowAutFeedbackSave } from 'src/ts/interfaces/models/setting';

const baseUrl = 'setting';

export const getSetSettingsService = (): Promise<{
  status: number;
  data: {
    settings: AllowAutFeedbackSave[];
    message: string;
  };
}> => api.get(`${baseUrl}`);

export const updateSettingService = (payload: {
  allow_feedback_saved: string;
}): Promise<{
  status: number;
  data: {
    settings: AllowAutFeedbackSave[];
    message: string;
  };
}> => api.put(`${baseUrl}/`, payload);
