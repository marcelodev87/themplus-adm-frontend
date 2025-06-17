<script setup lang="ts">
import { storeToRefs } from 'pinia';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { getSelectEnterprisesService } from 'src/services/enterprise-service';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import { useTemplateNotificationStore } from 'src/stores/template-notification-store';
import type { TemplateNotification } from 'src/ts/interfaces/models/template-notification';
import { computed, reactive, ref, watch } from 'vue';

defineOptions({
  name: 'SendNotifications',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { listTemplates } = storeToRefs(useTemplateNotificationStore());
const { listEnterprisesSelect } = storeToRefs(useEnterpriseStore());

const rows = listEnterprisesSelect;
const columns = [
  {
    name: 'desc',
    required: true,
    label: 'Nome',
    align: 'left' as const,
    field: (row: { name: string }) => row.name,
    format: (val: string) => `${val}`,
    sortable: true,
  },
];

const dataTemplate = reactive({
  title: '' as string,
  text: '' as string,
});
const defaultTemplateOption: TemplateNotification = {
  id: '',
  title: 'Não utilizar template',
  text: '',
};
const selectedEnterperise = ref();
const getSelectedString = () => {
  return selectedEnterperise.value.length === 0
    ? ''
    : `${selectedEnterperise.value.length} record${selectedEnterperise.value.length > 1 ? 's' : ''}`;
};
const selectedTemplate = ref<TemplateNotification>(defaultTemplateOption);
const optionsTemplate = computed(() => {
  return [defaultTemplateOption, ...listTemplates.value];
});
const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(
  selectedTemplate,
  (newVal) => {
    if (newVal) {
      dataTemplate.text = newVal.text;
    }
  },
  { immediate: true },
);

watch(open, async () => {
  if (open.value) {
    await getSelectEnterprisesService();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Enviar Notificação" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-select
            v-model="selectedTemplate"
            :options="optionsTemplate"
            option-value="id"
            option-label="title"
          ></q-select>
          <q-input
            v-model="dataTemplate.text"
            bg-color="white"
            label-color="black"
            outlined
            label="Texto"
            dense
            input-class="text-black"
            type="textarea"
            rows="5"
            style="max-height: 250px"
          />
          <div class="q-pa-none">
            <q-table
              flat
              bordered
              title="Empresas"
              :rows="rows"
              :columns="columns"
              row-key="name"
              :selected-rows-label="getSelectedString"
              selection="multiple"
              v-model:selected="selectedEnterperise"
            />

            <div class="q-mt-md">Selected: {{ JSON.stringify(selectedEnterperise) }}</div>
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="red" label="Fechar" size="md" flat @click="open = false" unelevated no-caps />
        <q-btn
          icon-right="send"
          label="Enviar"
          class="q-mr-sm bg-contabilidade"
          unelevated
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
