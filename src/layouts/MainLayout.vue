<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import Navbar from 'src/components/headers/Navbar.vue';
import FormPerfil from 'src/components/forms/FormPerfil.vue';

defineOptions({
  name: 'MainLayout',
});

const $q = useQuasar();
const route = useRoute();
const leftDrawerOpen = ref<boolean>(false);
const showFormPerfil = ref<boolean>(false);

const isActive = (routeName: string) => {
  return (
    route.name === routeName || (route.name === 'admin-bond-with-id' && routeName === 'admin-bond')
  );
};
const openFormPerfil = (): void => {
  showFormPerfil.value = true;
};
const closeFormPerfil = (): void => {
  showFormPerfil.value = false;
};
const changeShowMenuList = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const closeDrawer = (): void => {
  if ($q.screen.lt.md) {
    leftDrawerOpen.value = false;
  }
};
</script>
<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-grey-2">
      <Navbar
        @update:open-form-perfil="openFormPerfil"
        @update:change-open-menu="changeShowMenuList"
      />
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :show-if-above="!$q.screen.lt.md"
      :width="220"
      :breakpoint="700"
      side="left"
      behavior="desktop"
      bordered
      class="text-black"
    >
      <q-scroll-area class="fit">
        <q-list>
          <!-- <q-item
            clickable
            :to="{ name: 'admin-dashboard' }"
            :active="isActive('admin-dashboard')"
            active-class=" active-option-menu text-bold"
            @click="closeDrawer"
          >
            <q-item-section avatar>
              <q-icon name="space_dashboard" />
            </q-item-section>
            <q-item-section> Dashboard </q-item-section>
          </q-item> -->
          <q-item
            clickable
            :to="{ name: 'admin-enterprise' }"
            :active="isActive('admin-enterprise')"
            active-class=" active-option-menu text-bold"
            @click="closeDrawer"
          >
            <q-item-section avatar>
              <q-icon name="work" />
            </q-item-section>
            <q-item-section> Organizações </q-item-section>
          </q-item>
          <q-item
            clickable
            :to="{ name: 'admin-coupon' }"
            :active="isActive('admin-coupon')"
            active-class=" active-option-menu text-bold"
            @click="closeDrawer"
          >
            <q-item-section avatar>
              <q-icon name="percent" />
            </q-item-section>
            <q-item-section> Cupons </q-item-section>
          </q-item>
          <q-item
            clickable
            :to="{ name: 'admin-subscription' }"
            :active="isActive('admin-subscription')"
            active-class=" active-option-menu text-bold"
            @click="closeDrawer"
          >
            <q-item-section avatar>
              <q-icon name="sell" />
            </q-item-section>
            <q-item-section> Assinaturas </q-item-section>
          </q-item>
          <!-- <q-item
            clickable
            :to="{ name: 'admin-record' }"
            :active="isActive('admin-record')"
            active-class=" active-option-menu text-bold"
            @click="closeDrawer"
          >
            <q-item-section avatar>
              <q-icon name="content_paste_search" />
            </q-item-section>
            <q-item-section> Atividades </q-item-section>
          </q-item> -->
          <q-item
            clickable
            :to="{ name: 'admin-users' }"
            :active="isActive('admin-users')"
            active-class=" active-option-menu text-bold"
            @click="closeDrawer"
          >
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section> Usuários </q-item-section>
          </q-item>
          <q-item
            clickable
            :to="{ name: 'admin-departments' }"
            :active="isActive('admin-departments')"
            active-class=" active-option-menu text-bold"
            @click="closeDrawer"
          >
            <q-item-section avatar>
              <q-icon name="group_work" />
            </q-item-section>
            <q-item-section> Departamentos </q-item-section>
          </q-item>
          <q-item
            clickable
            :to="{ name: 'admin-feedbacks' }"
            :active="isActive('admin-feedbacks')"
            active-class=" active-option-menu text-bold"
            @click="closeDrawer"
          >
            <q-item-section avatar>
              <q-icon name="comment" />
            </q-item-section>
            <q-item-section> Feedbacks </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
      <FormPerfil :open="showFormPerfil" @update:open="closeFormPerfil" />
    </q-page-container>
  </q-layout>
</template>
