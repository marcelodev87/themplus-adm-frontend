import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  getFeedbacks,
  getFeedbacksSaved,
  saveFeedback,
  exclude,
  deleteSaved,
} from 'src/services/feedback-service';
import type { Feedback } from 'src/ts/interfaces/models/feedback';

export const useFeedbackStore = defineStore('feedback', {
  state: () => ({
    loadingFeedback: false as boolean,
    feedaback: null as Feedback | null,
    listFeedbacks: [] as Feedback[],
  }),

  actions: {
    setLoading(loading: boolean) {
      this.loadingFeedback = loading;
    },
    setFeedback(feedback: Feedback) {
      this.feedaback = feedback;
    },
    setListFeedbacks(feedbacks: Feedback[]) {
      feedbacks.map((item) => this.listFeedbacks.push(item));
    },
    clearListFeedbacks() {
      this.listFeedbacks.splice(0, this.listFeedbacks.length);
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
    async getFeedbacks() {
      this.setLoading(true);
      try {
        const response = await getFeedbacks();
        if (response.status === 200) {
          this.clearListFeedbacks();
          this.setListFeedbacks(response.data.feedbacks);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async saveFeedback(id: string | null) {
      this.setLoading(true);
      try {
        const response = await saveFeedback(id);
        if (response.status === 201) {
          this.clearListFeedbacks();
          this.setListFeedbacks(response.data.feedbacks);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getFeedbacksSaved() {
      this.setLoading(true);
      try {
        const response = await getFeedbacksSaved();
        if (response.status === 200) {
          this.clearListFeedbacks();
          this.setListFeedbacks(response.data.feedbacks);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async exclude(id: string | null) {
      this.setLoading(true);
      try {
        const response = await exclude(id);
        if (response.status === 200) {
          this.clearListFeedbacks();
          this.setListFeedbacks(response.data.feedbacks);
          this.createSuccess(response.data.message);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async deleteSaved(id: string | null) {
      this.setLoading(true);
      try {
        const response = await deleteSaved(id);
        if (response.status === 200) {
          this.clearListFeedbacks();
          this.setListFeedbacks(response.data.feedbacks);
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
