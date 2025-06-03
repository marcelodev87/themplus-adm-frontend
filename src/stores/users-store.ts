/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import {
  createUserMemberService,
  deleteUserMemberService,
  getUsersMembersService,
  updateActiveUserService,
  updateEnterpriseMemberService,
  updateUserMemberService,
} from 'src/services/users-service';
import type { UserADM } from 'src/ts/interfaces/models/user';
import { useEnterpriseStore } from './enterprise-store';

const {clearListMembers, setListMembers} = useEnterpriseStore()

export const useUsersMembersStore = defineStore('members', {
  state: () => ({
    loadingUsersMembers: false as boolean,
    listUserMember: [] as UserADM[],
  }),
  actions: {
    clearListUser() {
      this.listUserMember.splice(0, this.listUserMember.length);
    },
    setLoading(loading: boolean) {
      this.loadingUsersMembers = loading;
    },
    setListUser(users: UserADM[]) {
      users.map((item) => this.listUserMember.push(item));
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
    async getUsersMembers() {
      try {
        this.setLoading(true);
        const response = await getUsersMembersService();
        if (response.status === 200) {
          this.clearListUser();
          this.setListUser(response.data.users);
        }
      } catch (error) {
        this.createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateActiveUser(active: number, userId: string) {
      try {
        this.setLoading(true);
        const response = await updateActiveUserService(active, userId);
        if (response.status === 200) {
          this.clearListUser();
          this.setListUser(response.data.users);
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
    async createUserMember(
      name: string,
      position: string,
      email: string,
      password: string,
      department: string | null,
    ) {
      this.setLoading(true);
      try {
        const response = await createUserMemberService(name, position, email, password, department);
        if (response.status === 201) {
          this.clearListUser();
          this.setListUser(response.data.users);
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
    async updateUserMember(
      id: string,
      name: string,
      position: string,
      email: string,
      department: string | null,
    ) {
      try {
        this.setLoading(true);
        const response = await updateUserMemberService(id, name, position, email, department);
        if (response.status === 200) {
          this.clearListUser();
          this.setListUser(response.data.users);
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
    async updateEnterpriseMember(
          id: string,
          name: string,
          email: string,
          phone: string | null
        ) {
          this.setLoading(true);
          try {
            const response = await updateEnterpriseMemberService(id, name, email, phone);
            if (response.status === 200) {
              clearListMembers();
              setListMembers(response.data.members);
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
    async deleteUserMember(userMemberId: string) {
      try {
        this.setLoading(true);
        const response = await deleteUserMemberService(userMemberId);
        if (response.status === 200) {
          this.listUserMember = this.listUserMember.filter((item) => item.id !== userMemberId);
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
