<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Notify } from 'quasar';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import { useTemplateNotificationStore } from 'src/stores/template-notification-store';
import type { EnterpriseSelect } from 'src/ts/interfaces/models/enterprise';
import type { QuasarSelect, QuasarTable } from 'src/ts/interfaces/quasar/quasar';
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
const { getSelectEnterprises, sendNotificationEnterprise } = useEnterpriseStore();

const filterEnterprise = ref<string>('');
const columnsEnterprise = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome da organização',
    field: 'name',
    align: 'left',
  },
]);
const dataTemplate = reactive({
  title: '' as string,
  text: '' as string,
});
const selectedTemplate = ref<QuasarSelect<string>>({
  label: 'Sem template',
  value: '',
});
const selectedEnterprise = ref<EnterpriseSelect[]>([]);

const checkData = (): { status: boolean; message?: string } => {
  if (dataTemplate.text.trim() === '') {
    return { status: false, message: 'Digite um texto para enviar a notificação' };
  }
  if (selectedEnterprise.value.length <= 0) {
    return {
      status: false,
      message: 'Deve ser selecionado ao menos uma empresa para enviar a notificação',
    };
  }
  return { status: true };
};
const getSelectedString = () => {
  return selectedEnterprise.value.length === 0
    ? ''
    : `${selectedEnterprise.value.length} selecionado${selectedEnterprise.value.length > 1 ? 's' : ''}`;
};
const clear = (): void => {
  filterEnterprise.value = '';
  Object.assign(dataTemplate, {
    title: '',
    text: '',
  });
  selectedTemplate.value = {
    label: 'Sem template',
    value: '',
  };
  selectedEnterprise.value = [];
};
const send = async (): Promise<void> => {
  const check = checkData();
  if (check.status) {
    const data = {
      enterprisesId: selectedEnterprise.value.map((item) => item.id),
      title: dataTemplate.title,
      text: dataTemplate.text,
    };
    const response = await sendNotificationEnterprise(data);

    if (response?.status === 200) {
      clear();
      emit('update:open');
    }
  } else {
    Notify.create({
      message: check.message || '',
      type: 'negative',
    });
  }
};

const optionsTemplate = computed(() => {
  return [
    { label: 'Sem template', value: '' },
    ...listTemplates.value.map((item) => {
      return {
        label: item.title,
        value: item.text,
      };
    }),
  ];
});
const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(selectedTemplate, () => {
  if (selectedTemplate.value.value === '') {
    dataTemplate.title = '';
    dataTemplate.text = '';
  } else {
    dataTemplate.title = selectedTemplate.value.label;
    dataTemplate.text = selectedTemplate.value.value;
  }
});
watch(open, async () => {
  if (open.value) {
    clear();
    await getSelectEnterprises();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic" style="width: 900px; max-width: 98vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Enviar notificação" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-select
            v-model="selectedTemplate"
            :options="optionsTemplate"
            label="Utilize um template"
            map-options
            outlined
            dense
            options-dense
            bg-color="white"
            label-color="black"
          />
          <q-input
            v-model="dataTemplate.title"
            bg-color="white"
            label-color="black"
            outlined
            label="Título da notificação"
            dense
            input-class="text-black"
            rows="5"
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
            style="max-height: 250px"
          />
          <q-table
            flat
            bordered
            :rows="listEnterprisesSelect"
            :columns="columnsEnterprise"
            :filter="filterEnterprise"
            row-key="id"
            :selected-rows-label="getSelectedString"
            selection="multiple"
            :rows-per-page-options="[0]"
            v-model:selected="selectedEnterprise"
            style="height: 350px"
          >
            <template v-slot:top>
              <span class="text-subtitle2">Lista de organizações</span>
              <q-space />
              <q-input outlined v-model="filterEnterprise" dense label="Pesquisar">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
          </q-table>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="red" label="Fechar" size="md" flat @click="open = false" unelevated no-caps />
        <q-btn
          @click="send"
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
