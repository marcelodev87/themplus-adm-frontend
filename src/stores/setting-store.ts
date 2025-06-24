import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { getSetSettingsService, updateSettingService } from 'src/services/setting-service';
import type { AllowAutFeedbackSave } from 'src/ts/interfaces/models/setting';

export const useSettingStore = defineStore('setting', {
  state: () => ({
    loadingSetting: false as boolean,
    listSetting: [] as AllowAutFeedbackSave[],
  }),
  actions: {
    setLoading(loading: boolean) {
      this.loadingSetting = loading;
    },
    setListSettings(settings: AllowAutFeedbackSave[]) {
      settings.map((item) => this.listSetting.push(item));
    },
    clearListSettings() {
      this.listSetting.splice(0, this.listSetting.length);
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
    async getSetting() {
      this.setLoading(true);
      try {
        const response = await getSetSettingsService();
        if (response.status === 200) {
          this.clearListSettings();
          this.setListSettings(response.data.settings);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateSettings(payload: { allow_feedback_saved: string }) {
      this.setLoading(true);
      try {
        const response = await updateSettingService(payload);
        if (response.status === 200) {
          this.clearListSettings();
          this.setListSettings(response.data.settings);
          this.createSuccess(response.data.message);
        }
        return response;
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
