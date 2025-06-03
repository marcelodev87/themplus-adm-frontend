/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  createEnterpriseByAdmService,
  deleteEnterpriseService,
  getCouponsInEnterpriseService,
  getEnterprisesService,
  removeCouponEnterpriseService,
  setCouponService,
  updateEnterpriseByAdmService,
  getMembersByEnterpriseService,
} from 'src/services/enterprise-service';
import type { Enterprise, EnterpriseCreate } from 'src/ts/interfaces/models/enterprise';
import type { User, UserCeate } from 'src/ts/interfaces/models/user';

export const useEnterpriseStore = defineStore('enterprise', {
  state: () => ({
    loadingEnterprise: false as boolean,
    enterprise: null as Enterprise | null,
    listEnterprises: [] as Enterprise[],
    listEnterpriseMembers: [] as User[],
  }),
  actions: {
    setLoading(loading: boolean) {
      this.loadingEnterprise = loading;
    },
    setEnterprise(enterprise: Enterprise) {
      this.enterprise = enterprise;
    },
    setListEnterprises(enterprises: Enterprise[]) {
      enterprises.map((item) => this.listEnterprises.push(item));
    },
    setListMembers(enterpriseMembers: User[]) {
      enterpriseMembers.map((item) => this.listEnterpriseMembers.push(item));
    },
    clearListEnterprises() {
      this.listEnterprises.splice(0, this.listEnterprises.length);
    },
    clearListMembers() {
      this.listEnterpriseMembers.splice(0, this.listEnterpriseMembers.length);
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
    async getEnterprises() {
      this.setLoading(true);
      try {
        const response = await getEnterprisesService();
        if (response.status === 200) {
          this.clearListEnterprises();
          this.setListEnterprises(response.data.enterprises);
        }
        return response;
      } catch (error) {
        this.createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
    async getMembersByEnterprise(enterpriseId: string) {
      this.setLoading(true);
      try {
        const response = await getMembersByEnterpriseService(enterpriseId);
        if (response.status === 200) {
          this.clearListMembers();
          this.setListMembers(response.data.members);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getCouponsInEnterprise(entepriseId: string) {
      this.setLoading(true);
      try {
        return await getCouponsInEnterpriseService(entepriseId);
      } catch (error) {
        this.createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
    async removeCouponEnterprise(id: string) {
      this.setLoading(true);
      try {
        const response = await removeCouponEnterpriseService(id);
        if (response.status === 200) {
          this.createSuccess(response.data.message);
        }
        return response;
      } catch (error) {
        this.createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
    async setCoupon(enterpriseId: string, couponId: string | null) {
      this.setLoading(true);
      try {
        return await setCouponService(enterpriseId, couponId);
      } catch (error) {
        this.createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
    async createEnterpriseByAdm(enterprise: EnterpriseCreate, user: UserCeate) {
      this.setLoading(true);
      try {
        const response = await createEnterpriseByAdmService(enterprise, user);
        if (response.status === 201) {
          this.clearListEnterprises();
          this.setListEnterprises(response.data.enterprises);
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
    async updateEnterpriseByAdm(payload: {
      id: string;
      name: string;
      cnpj: string | null;
      cpf: string | null;
      cep: string | null;
      state: string | null;
      city: string | null;
      neighborhood: string | null;
      address: string | null;
      complement: string | null;
      number_address: string | null;
      email: string | null;
      phone: string | null;
    }) {
      this.setLoading(true);
      try {
        const response = await updateEnterpriseByAdmService(payload);
        if (response.status === 200) {
          this.clearListEnterprises();
          this.setListEnterprises(response.data.enterprises);
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
    async deleteEnterprise(enterpriseId: string) {
      this.setLoading(true);
      try {
        const response = await deleteEnterpriseService(enterpriseId);
        if (response.status === 200) {
          this.listEnterprises = this.listEnterprises.filter((item) => item.id !== enterpriseId);
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
