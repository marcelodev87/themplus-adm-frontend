/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { getSubscriptionsService, updateSubscriptionService } from 'src/services/subscription-service';
import type { Subscription } from 'src/ts/interfaces/models/subscriptions';

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    loadingSubscription: false as boolean,
    listSubscription: [] as Subscription[],
  }),
  actions: {
    clearListSubscription() {
      this.listSubscription.splice(0, this.listSubscription.length);
    },
    setLoading(loading: boolean) {
      this.loadingSubscription = loading;
    },
    setListSubscription(data: Subscription[]) {
      data.map((item) => this.listSubscription.push(item));
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
    async getSubscriptions() {
      try {
        this.setLoading(true);
        const response = await getSubscriptionsService();
        if (response.status === 200) {
          this.clearListSubscription();
          this.setListSubscription(response.data.subscriptions);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateSubscription(
      id: string,
      price: number,
    ) {
      try {
        this.setLoading(true);
        const response = await updateSubscriptionService(
          id,
          price
        );
        if (response.status === 200) {
          this.clearListSubscription();
        this.setListSubscription(response.data.subscriptions);
          this.createSuccess(response.data.message);
        }
        return response;
      } catch (error) {
        this.createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },
  },
});
