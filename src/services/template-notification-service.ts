import { api } from 'src/boot/axios';
import type { TemplateNotification } from 'src/ts/interfaces/models/template-notification';

const baseUrl = 'template-notification';

export const getTemplatesService = (): Promise<{
  status: number;
  data: {
    templates: TemplateNotification[];
    message: string;
  };
}> => api.get(`/${baseUrl}`);

export const saveTemplateService = (
  title: string,
  text: string,
): Promise<{
  status: number;
  data: {
    templates: TemplateNotification[];
    message: string;
  };
}> => api.post(`/${baseUrl}`, { title, text });

export const updateTempĺateService = (
  id: string,
  title: string,
  text: string,
): Promise<{
  status: number;
  data: {
    templates: TemplateNotification[];
    message: string;
  };
}> => api.put(`/${baseUrl}`, { id, title, text });

export const deleteTemplateService = (
  id: string,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
