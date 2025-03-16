<script setup lang="ts">
import UserOptions from './UserOptions.vue';

defineOptions({
  name: 'Navbar',
});

const emit = defineEmits<{
  'update:openFormPerfil': [void];
  'update:changeOpenMenu': [void];
}>();
</script>
<template>
  <nav>
    <q-toolbar class="row items-center justify-between" style="height: 50px">
      <div class="row items-center q-gutter-x-sm">
        <q-btn
          @click="emit('update:changeOpenMenu')"
          flat
          color="black"
          icon-right="menu"
          rounded
        />
        <q-img
          v-show="!$q.screen.lt.md"
          @click="$router.push({ name: 'admin-dashboard' })"
          src="/images/logo/logo.png"
          spinner-color="white"
          width="120px"
          class="hover cursor-pointer hidden-md"
        />
      </div>
      <div class="row justify-end">
        <UserOptions @update:open-form-perfil="emit('update:openFormPerfil')" />
      </div>
    </q-toolbar>
  </nav>
</template>
