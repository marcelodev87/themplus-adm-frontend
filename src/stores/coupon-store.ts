/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { deleteCouponService, getCouponsService } from 'src/services/coupon-service';
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
    // async getOrdersViewCounter() {
    //   try {
    //     this.setLoading(true);
    //     const response = await getOrdersViewCounterService();
    //     if (response.status === 200) {
    //       this.clearListOrderCounter();
    //       this.setListOrderCounter(response.data.orders);
    //       this.setFilledData(response.data.filled_data);
    //       updateNotifications(response.data.notifications);
    //     }
    //   } catch (error) {
    //     this.createError(error);
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
    // async getBonds() {
    //   try {
    //     this.setLoading(true);
    //     const response = await getBondsService();
    //     if (response.status === 200) {
    //       this.clearListBond();
    //       this.setListBond(response.data.bonds);
    //       this.setFilledData(response.data.filled_data);
    //       updateNotifications(response.data.notifications);
    //     }
    //   } catch (error) {
    //     this.createError(error);
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
    // async sendRequestEnterprise(enterpriseId: string, description: string | null) {
    //   try {
    //     this.setLoading(true);
    //     const response = await sendRequestEnterpriseService(enterpriseId, description);
    //     if (response.status === 201) {
    //       this.clearListOrderCounter();
    //       this.setListOrderCounter(response.data.orders);
    //       this.createSuccess(response.data.message);
    //     }

    //     return response;
    //   } catch (error) {
    //     this.createError(error);
    //     return null;
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
    // async updateRequestEnterprise(id: string, description: string | null) {
    //   try {
    //     this.setLoading(true);
    //     const response = await updateRequestEnterpriseService(id, description);
    //     if (response.status === 200) {
    //       this.clearListOrderCounter();
    //       this.setListOrderCounter(response.data.orders);
    //       this.createSuccess(response.data.message);
    //     }
    //     return response;
    //   } catch (error) {
    //     this.createError(error);
    //     return null;
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
    // async actionRequestEnterprise(id: string, status: 'declined' | 'accepted') {
    //   try {
    //     this.setLoading(true);
    //     const response = await actionRequestEnterpriseService(id, status);
    //     if (response.status === 200) {
    //       this.clearListOrderClient();
    //       this.setListOrderClient(response.data.orders);
    //       this.setHasCounter(response.data.counter);
    //       this.createSuccess(response.data.message);
    //     }
    //     return response;
    //   } catch (error) {
    //     this.createError(error);
    //     return null;
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
    // async deleteOrder(orderId: string) {
    //   this.setLoading(true);
    //   try {
    //     const response = await deleteOrderService(orderId);
    //     if (response.status === 200) {
    //       this.listOrderCounter = this.listOrderCounter.filter((item) => item.id !== orderId);
    //       this.createSuccess(response.data.message);
    //     }
    //   } catch (error) {
    //     this.createError(error);
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
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
