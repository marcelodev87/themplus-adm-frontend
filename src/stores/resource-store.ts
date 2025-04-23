/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { getResourcesService } from 'src/services/resource-service';
import type { QuasarSelect } from 'src/ts/interfaces/quasar/quasar';

export const useResourceStore = defineStore('resource', {
  state: () => ({
    loadingResource: false as boolean,
    listResource: [] as QuasarSelect<string>[],
  }),
  actions: {
    clearListResource() {
      this.listResource.splice(0, this.listResource.length);
    },
    setLoading(loading: boolean) {
      this.loadingResource = loading;
    },
    setListResource(resources: QuasarSelect<string>[]) {
      resources.map((item) => this.listResource.push(item));
    },
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
    async getResources() {
      this.setLoading(true);
      try {
        const response = await getResourcesService();
        if (response.status === 200) {
          this.clearListResource();
          this.setListResource(response.data.services);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
