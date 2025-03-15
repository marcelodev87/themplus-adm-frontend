<script setup lang="ts">
import { ref } from 'vue';
import UserOptions from './UserOptions.vue';

defineOptions({
  name: 'Navbar',
});

const emit = defineEmits<{
  'update:openFormPerfil': [void];
  'update:changeOpenMenu': [void];
}>();

const showFormFedback = ref<boolean>(false);
const showInbox = ref<boolean>(false);

const closeFormFeedback = (): void => {
  showFormFedback.value = false;
};
const closeInbox = (): void => {
  showInbox.value = false;
};
</script>
<template>
  <nav>
    <q-toolbar class="row items-center justify-between">
      <div class="row items-center q-gutter-x-sm">
        <q-btn
          @click="emit('update:changeOpenMenu')"
          flat
          color="black"
          icon-right="menu"
          rounded
        />
        <img
          v-show="!$q.screen.lt.md"
          @click="$router.push({ name: 'admin-dashboard' })"
          class="cursor-pointer hidden-md"
          src="/images/logo/logo.png"
          width="120px"
        />
      </div>
      <div class="row justify-end">
        <UserOptions @update:open-form-perfil="emit('update:openFormPerfil')" />
      </div>
    </q-toolbar>
    <FormFeedback :open="showFormFedback" @update:open="closeFormFeedback" />
    <Inbox :open="showInbox" @update:open="closeInbox" />
  </nav>
</template>
