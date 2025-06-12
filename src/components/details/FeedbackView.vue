console
<script lang="ts" setup>
import { computed, reactive, watch } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import type { Feedback } from 'src/ts/interfaces/models/feedback';

defineOptions({
  name: 'FeedbackView',
});

const props = defineProps<{
  open: boolean;
  feedbackData: Feedback | null;
}>();

const emit = defineEmits<{
  'update:open': [void];
}>();

const dataFeedback = reactive({
  userName: '' as string,
  organizationName: '' as string,
  created: '' as string,
  message: '' as string,
});

const mountFeedback = (): void => {
  Object.assign(dataFeedback, {
    userName: props.feedbackData?.user_name,
    organizationName: props.feedbackData?.organization_name,
    created: props.feedbackData?.created,
    message: props.feedbackData?.message,
  });
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    mountFeedback();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Detalhes do Feedback" />
      </q-card-section>
      <q-card-section>
        <q-form class="q-gutter-y-sm q-mb-sm">
          <q-input
            v-model="dataFeedback.userName"
            bg-color="white"
            label-color="black"
            filled
            label="Usuário"
            dense
            input-class="text-black"
            readonly
          />
          <q-input
            v-model="dataFeedback.organizationName"
            bg-color="white"
            label-color="black"
            filled
            label="Empresa"
            dense
            input-class="text-black"
            readonly
          />
          <q-input
            v-model="dataFeedback.created"
            bg-color="white"
            label-color="black"
            filled
            label="Data de criação"
            dense
            input-class="text-black"
            readonly
          />

          <q-input
            v-model="dataFeedback.message"
            bg-color="white"
            label-color="black"
            filled
            label="Menssagem"
            dense
            input-class="text-black"
            readonly
            autogrow
            style="max-height: 350px; overflow-y: auto"
          />
        </q-form>
        <q-card-actions align="right" class="q-pa-none">
          <q-btn color="red" label="Fechar" size="md" @click="open = false" unelevated no-caps />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
