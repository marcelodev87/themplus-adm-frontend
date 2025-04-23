/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  createCouponService,
  deleteCouponService,
  getCouponService,
  getCouponsService,
  updateCouponService,
} from 'src/services/coupon-service';
import type { CouponTable } from 'src/ts/interfaces/models/subscriptions';

export const useCouponStore = defineStore('coupon', {
  state: () => ({
    loadingCoupon: false as boolean,
    listCoupon: [] as CouponTable[],
  }),
  actions: {
    clearListCoupon() {
      this.listCoupon.splice(0, this.listCoupon.length);
    },
    setLoading(loading: boolean) {
      this.loadingCoupon = loading;
    },
    setListCoupon(data: CouponTable[]) {
      data.map((item) => this.listCoupon.push(item));
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
    async getCoupons() {
      try {
        this.setLoading(true);
        const response = await getCouponsService();
        if (response.status === 200) {
          this.clearListCoupon();
          this.setListCoupon(response.data.coupons);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getCoupon(id: string) {
      try {
        this.setLoading(true);
        return await getCouponService(id);
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createCoupon(
      name: string,
      type: string,
      subscription: string | null,
      service: string | null,
      discount: number | null,
      dateExpiration: string | null,
      limit: number | null,
      description: string | null,
      code: string,
    ) {
      try {
        this.setLoading(true);
        const response = await createCouponService(
          name,
          type,
          subscription,
          service,
          discount,
          dateExpiration,
          limit,
          description,
          code,
        );
        if (response.status === 200) {
          this.clearListCoupon();
          this.setListCoupon(response.data.coupons);
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
    async updateCoupon(
      id: string,
      name: string,
      type: string,
      subscription: string | null,
      resource: string | null,
      discount: number | null,
      dateExpiration: string | null,
      limit: number | null,
      description: string | null,
      code: string,
    ) {
      try {
        this.setLoading(true);
        const response = await updateCouponService(
          id,
          name,
          type,
          subscription,
          resource,
          discount,
          dateExpiration,
          limit,
          description,
          code,
        );
        if (response.status === 200) {
          this.clearListCoupon();
          this.setListCoupon(response.data.coupons);
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
    async deleteCoupon(id: string) {
      this.setLoading(true);
      try {
        const response = await deleteCouponService(id);
        if (response.status === 200) {
          this.listCoupon = this.listCoupon.filter((item) => item.id != id);
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
