/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { deleteEnterpriseService } from 'src/services/coupon-service';
import {
  createEnterpriseByAdmService,
  getEnterprisesService,
} from 'src/services/enterprise-service';
import type { Enterprise, EnterpriseCreate } from 'src/ts/interfaces/models/enterprise';
import type { UserCeate } from 'src/ts/interfaces/models/user';

export const useEnterpriseStore = defineStore('enterprise', {
  state: () => ({
    loadingEnterprise: false as boolean,
    enterprise: null as Enterprise | null,
    listEnterprises: [] as Enterprise[],
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
    clearListEnterprises() {
      this.listEnterprises.splice(0, this.listEnterprises.length);
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
    async createEnterpriseByAdm(enterprise: EnterpriseCreate, user: UserCeate) {
      this.setLoading(true);
      try {
        const response = await createEnterpriseByAdmService(enterprise, user);
        if (response.status === 200) {
          this.clearListEnterprises();
          this.setListEnterprises(response.data.enterprises);
        }
        return response;
      } catch (error) {
        this.createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },
    // async getEnterprisesView() {
    //   this.setLoading(true);
    //   try {
    //     this.clearListViewEnterprise();
    //     const response = await getEnterprisesViewService();
    //     if (response.status === 200) {
    //       this.setListViewEnterprise(response.data.enterprises);
    //     }
    //     return response;
    //   } catch (error) {
    //     this.createError(error);
    //     return undefined;
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
    // async saveEnterpriseView(enterprise: string | null) {
    //   this.setLoading(true);
    //   try {
    //     this.clearListViewEnterprise();
    //     const response = await saveEnterpriseViewService(enterprise);
    //     if (response.status === 200) {
    //       this.setListViewEnterprise(response.data.enterprises);
    //       setUser(response.data.user);
    //       this.createSuccess(response.data.message);
    //     }
    //     return response;
    //   } catch (error) {
    //     this.createError(error);
    //     return undefined;
    //   }
    // },
    // async showEnterprise(id: string) {
    //   this.setLoading(true);
    //   try {
    //     this.setCounterSearch(null);
    //     const response = await showEnterpriseService(id);
    //     if (response.status === 200) {
    //       this.setCounterSearch(response.data.counter);
    //     }
    //   } catch (error) {
    //     this.createError(error);
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
    // async searchEnterprise(text: string) {
    //   this.setLoading(true);
    //   try {
    //     this.clearResultSearchEnterprise();
    //     const response = await searchEnterpriseService(text);
    //     if (response.status === 200) {
    //       this.setResultSearchEnterprise(response.data.enterprises);
    //       if (this.listSearchEnterprise.length === 0) {
    //         Notify.create({
    //           message: 'Nenhuma organização foi encontrada',
    //           type: 'warning',
    //         });
    //       }
    //     }
    //   } catch (error) {
    //     this.createError(error);
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
    // // async createCategory(category: string, type: 'Entrada' | 'Saída') {
    // //   this.setLoading(true);
    // //   try {
    // //     const response = await createCategoryService(
    // //       category,
    // //       type.toLowerCase()
    // //     );
    // //     if (response.status === 201) {
    // //       this.clearListCategory();
    // //       this.setListCategory(response.data.categories);
    // //       this.createSuccess(response.data.message);
    // //     }
    // //   } catch (error) {
    // //     this.createError(error);
    // //   } finally {
    // //     this.setLoading(false);
    // //   }
    // // },
    // async unlinkCounter() {
    //   this.setLoading(true);
    //   try {
    //     const response = await unlinkCounterService();
    //     if (response.status === 200) {
    //       hasCounter.value = null;
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
    // async createEnterpriseByCounter(payload: {
    //   name: string;
    //   cnpj: string | null;
    //   cpf: string | null;
    //   cep: string | null;
    //   state: string | null;
    //   city: string | null;
    //   neighborhood: string | null;
    //   address: string | null;
    //   complement: string | null;
    //   number_address: string | null;
    //   email: string | null;
    //   phone: string | null;
    // }) {
    //   this.setLoading(true);
    //   try {
    //     const response = await createEnterpriseByCounterService(payload);
    //     if (response.status === 201) {
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
    // async updateEnterprise(payload: {
    //   id: string;
    //   name: string;
    //   cnpj: string | null;
    //   cpf: string | null;
    //   cep: string | null;
    //   state: string | null;
    //   city: string | null;
    //   neighborhood: string | null;
    //   address: string | null;
    //   complement: string | null;
    //   number_address: string | null;
    //   email: string | null;
    //   phone: string | null;
    // }) {
    //   this.setLoading(true);
    //   try {
    //     const response = await updateEnterpriseService(payload);
    //     if (response.status === 200) {
    //       this.setEnterprise(response.data.enterprise);
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
    // async updateCodeFinancial(id: string, code: number | null) {
    //   this.setLoading(true);
    //   try {
    //     const response = await updateCodeFinancialService(id, code);
    //     if (response.status === 200) {
    //       clearListBond();
    //       setListBond(response.data.bonds);
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
    async deleteEnterprise(enterpriseId: string) {
      this.setLoading(true);
      try {
        const response = await deleteEnterpriseService(enterpriseId);
        if (response.status === 200) {
          this.setListEnterprises(this.listEnterprises.filter((item) => item.id !== enterpriseId));
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
