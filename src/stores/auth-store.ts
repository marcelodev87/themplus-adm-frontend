/* eslint-disable @typescript-eslint/no-explicit-any */
import { useStorage } from '@vueuse/core';
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  doLoginService,
  doRegisterService,
  doResetService,
  doVerifyService,
  setNewPasswordService,
  updateUserDataService,
  updateUserPasswordService,
} from 'src/services/auth-service';
import type { User } from 'src/ts/interfaces/models/user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loadingAuth: false as boolean,
    user: useStorage('themplus_user', {} as User | null),
    token: useStorage('themplus_token', null as string | null),
  }),
  actions: {
    setUser(user: User | null) {
      this.user = user;
    },
    setToken(token: string | null) {
      this.token = token;
    },
    setLoading(loading: boolean) {
      this.loadingAuth = loading;
    },
    createSuccess(message: string) {
      Notify.create({
        message,
        type: 'positive',
      });
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
    async doLogin(email: string, password: string) {
      try {
        this.setLoading(true);
        const response = await doLoginService(email, password);
        if (response.status === 200) {
          this.setUser(response.data.user);
          this.setToken(response.data.token);
          await this.router.push({ name: 'admin-enterprise' });
          // await this.router.push({ name: 'admin-dashboard' });
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async doReset(email: string) {
      try {
        this.setLoading(true);
        const response = await doResetService(email);
        if (response.status === 200) {
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
    async doVerify(code: string, email: string) {
      try {
        this.setLoading(true);
        const response = await doVerifyService(code, email);
        if (response.status === 200) {
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
    async setNewPassword(code: string, email: string) {
      try {
        this.setLoading(true);
        const response = await setNewPasswordService(code, email);
        if (response.status === 200) {
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
    async doRegister(
      name: string,
      email: string,
      password: string,
      nameEnterprise: string,
      position: string,
    ) {
      this.setLoading(true);
      try {
        this.setLoading(true);
        const response = await doRegisterService(name, email, password, nameEnterprise, position);
        if (response.status === 201) {
          this.setUser(response.data.user);
          this.setToken(response.data.token);

          Notify.create({
            message: response.data.message,
            type: 'positive',
          });
          await this.router.push({ name: 'admin-feed' });
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateUserData(name: string, email: string, department: string | null) {
      try {
        this.setLoading(true);
        const response = await updateUserDataService(name, email, department);
        if (response.status === 200) {
          this.setUser(response.data.user);

          Notify.create({
            message: response.data.message,
            type: 'positive',
          });
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateUserPassword(passwordActual: string, passwordNew: string) {
      try {
        this.setLoading(true);
        const response = await updateUserPasswordService(passwordActual, passwordNew);
        if (response.status === 200) {
          Notify.create({
            message: response.data.message,
            type: 'positive',
          });
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
