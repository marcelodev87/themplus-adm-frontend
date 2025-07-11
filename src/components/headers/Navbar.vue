<script setup lang="ts">
import { storeToRefs } from 'pinia';
import UserOptions from './UserOptions.vue';
import { useFeedbackStore } from 'src/stores/feedback-store';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'Navbar',
});

const { countFeedbacks } = storeToRefs(useFeedbackStore());

const router = useRouter();

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
        <div>
          <q-btn
            @click="router.push('feedbacks')"
            flat
            color="black"
            icon-right="notifications"
            rounded
            class="q-mr-md"
          >
            <q-tooltip> Notificações </q-tooltip>
            <q-badge
              v-show="countFeedbacks > 0"
              color="red"
              rounded
              floating
              :label="countFeedbacks"
            />
          </q-btn>
          <UserOptions @update:open-form-perfil="emit('update:openFormPerfil')" />
        </div>
      </div>
    </q-toolbar>
  </nav>
</template>
