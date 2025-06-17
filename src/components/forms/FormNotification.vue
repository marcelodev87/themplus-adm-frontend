<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import type { TemplateNotification } from 'src/ts/interfaces/models/template-notification';
import { useTemplateNotificationStore } from 'src/stores/template-notification-store';
import { storeToRefs } from 'pinia';
import { Notify } from 'quasar';
const { saveTemplate, updateTemplate } = useTemplateNotificationStore();
const { loadingTemplate } = storeToRefs(useTemplateNotificationStore());

defineOptions({
  name: 'FormNotification',
});

const props = defineProps<{
  open: boolean;
  template: TemplateNotification | null;
}>();

const emit = defineEmits<{
  'update:open': [void];
}>();

const dataTemplate = reactive({
  title: '' as string,
  text: '' as string,
});

const clear = (): void => {
  Object.assign(dataTemplate, {
    title: '',
    text: '',
  });
};

const save = async () => {
  const response = await saveTemplate(dataTemplate.title, dataTemplate.text);
  if (response?.status === 201) {
    clear();
    emit('update:open');
  } else {
    Notify.create({
      message: 'Erro ao criar template',
      type: 'negative',
    });
  }
};
const update = async () => {
  const response = await updateTemplate(props.template?.id ?? '', dataTemplate.title, dataTemplate.text);
  if (response?.status === 200) {
    clear();
    emit('update:open');
  }
};
const mountEdit = (): void => {
  Object.assign(dataTemplate, {
    title: props.template?.title ?? '',
    text: props.template?.text ?? '',
  });
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    mountEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="
            props.template ? 'Atualizar template' : 'Criar template'
          "
        />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataTemplate.title"
            bg-color="white"
            label-color="black"
            outlined
            label="Título"
            dense
            input-class="text-black"
            maxlength="40"
          />
          <q-input
            v-model="dataTemplate.text"
            bg-color="white"
            label-color="black"
            outlined
            label="Texto"
            dense
            input-class="text-black no-resize"
            type="textarea"
            rows="5"
          />
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="red" label="Fechar" size="md" flat @click="open = false" unelevated no-caps />
        <q-btn
          v-if="!props.template"
          @click="save"
          color="primary"
          label="Salvar"
          size="md"
          :loading="loadingTemplate"
          unelevated
          no-caps
        />
        <q-btn
          v-else
          @click="update"
          color="primary"
          label="Atualizar"
          size="md"
          :loading="loadingTemplate"
          unelevated
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
