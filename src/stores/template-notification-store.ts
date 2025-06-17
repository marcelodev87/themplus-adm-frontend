import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  deleteTemplateService,
  getTemplatesService,
  saveTemplateService,
  updateTempĺateService,
} from 'src/services/tempĺate-notification-service';
import type { TemplateNotification } from 'src/ts/interfaces/models/template-notification';

export const useTemplateNotificationStore = defineStore('template-notification', {
  state: () => ({
    loadingTemplate: false as boolean,
    listTemplates: [] as TemplateNotification[],
  }),
  actions: {
    clearListTemplate() {
      this.listTemplates.splice(0, this.listTemplates.length);
    },
    setListTemplate(data: TemplateNotification[]) {
      data.map((item) => this.listTemplates.push(item));
    },
    setLoading(loading: boolean) {
      this.loadingTemplate = loading;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createError(error: any) {
      let message = 'Error';
      if (error instanceof AxiosError) {
        message = error.response?.data?.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      Notify.create({
        message,
        type: 'negative',
      });
    },
    createSuccess(message: string) {
      Notify.create({
        message,
        type: 'positive',
      });
    },
    async getTemplates() {
      try {
        this.setLoading(true);
        const response = await getTemplatesService();
        if (response.status === 200) {
          this.clearListTemplate();
          this.setListTemplate(response.data.templates);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async saveTemplate(title: string, text: string) {
      try {
        this.setLoading(true);
        const response = await saveTemplateService(title, text);
        if (response.status === 201) {
          this.clearListTemplate();
          this.setListTemplate(response.data.templates);
          this.createSuccess(response.data.message);
        }
        return response;
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateTemplate(id: string, title: string, text: string) {
      try {
        this.setLoading(true);
        const response = await updateTempĺateService(id, title, text);
        if (response.status === 200) {
          this.clearListTemplate();
          this.setListTemplate(response.data.templates);
          this.createSuccess(response.data.message);
        }
        return response;
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async deleteTemplate(id: string) {
      try {
        this.setLoading(true);
        const response = await deleteTemplateService(id);
        if (response.status === 200) {
          this.listTemplates = this.listTemplates.filter((item) => item.id != id);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
