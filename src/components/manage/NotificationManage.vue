<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import FormNotification from 'src/components/forms/FormNotification.vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { useTemplateNotificationStore } from 'src/stores/template-notification-store';
import type { TemplateNotification } from 'src/ts/interfaces/models/template-notification';
import type { QuasarTable } from 'src/ts/interfaces/quasar/quasar';
import { computed, reactive, ref, watch } from 'vue';
import SendNotification from './SendNotification.vue';
import Paginate from '../general/Paginate.vue';

defineOptions({
  name: 'NotificationManagement',
});

const { getTemplates, deleteTemplate } = useTemplateNotificationStore();
const { loadingTemplate, listTemplates } = storeToRefs(useTemplateNotificationStore());

const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(10);
const selectedDataExclude = ref<string | null>(null);
const selectedData = ref<TemplateNotification | null>(null);
const showFormNotification = ref<boolean>(false);
const showSendNotification = ref<boolean>(false);

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  'update:open': [void];
}>();

const templatesSortPagination = ref<{
  sortBy: string | null;
  descending: boolean;
  page: number;
  rowsPerPage: number;
}>({ sortBy: null, descending: false, page: 1, rowsPerPage: 0 });
const columnsTemplates = reactive<QuasarTable[]>([
  {
    name: 'title',
    label: 'Título',
    field: 'title',
    align: 'left',
    sortable: true,
    sort: (a, b) =>
      String(a ?? '').localeCompare(String(b ?? ''), 'pt-BR', { sensitivity: 'base' }),
  },
  {
    name: 'text',
    label: 'Messagem',
    field: 'text',
    align: 'left',
    style: 'max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
    sortable: true,
    sort: (a, b) =>
      String(a ?? '').localeCompare(String(b ?? ''), 'pt-BR', { sensitivity: 'base' }),
  },
  {
    name: 'action',
    label: 'Ações',
    field: 'action',
    align: 'right',
  },
]);

const clear = (): void => {
  selectedDataExclude.value = null;
  selectedData.value = null;
};

const handleEdit = (data: TemplateNotification) => {
  selectedData.value = data;
  openFormNotification();
};
const excludeTemplate = async (id: string) => {
  selectedDataExclude.value = id;
  await deleteTemplate(id);
};
const openFormNotification = (): void => {
  showFormNotification.value = true;
};
const closeFormNotification = (): void => {
  clear();
  showFormNotification.value = false;
};
const openSendNotification = (): void => {
  showSendNotification.value = true;
};
const closeSendNotification = (): void => {
  showSendNotification.value = false;
  clear();
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const sortedTemplates = computed(() => {
  const { sortBy, descending } = templatesSortPagination.value;
  if (!sortBy) return listTemplates.value;
  const col = columnsTemplates.find((c) => c.name === sortBy);
  if (!col) return listTemplates.value;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getVal = (row: any) =>
    typeof col.field === 'function'
      ? col.field(row)
      : col.field
        ? String(col.field)
            .split('.')
            .reduce((o: any, k: string) => o?.[k], row)
        : '';
  return [...listTemplates.value].sort((a, b) => {
    const res = col.sort
      ? col.sort(getVal(a), getVal(b), a, b)
      : String(getVal(a) ?? '').localeCompare(String(getVal(b) ?? ''), 'pt-BR', {
          sensitivity: 'base',
        });
    return descending ? -res : res;
  });
});
const listTemplateCurrent = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return sortedTemplates.value.slice(start, end);
});
const maxPages = computed(() => {
  return Math.ceil(listTemplates.value.length / rowsPerPage.value);
});

watch(open, async () => {
  if (open.value) {
    clear();
    await getTemplates();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic" style="min-width: 70vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Gerenciamento de notificações" />
        <q-card-section class="q-my-sm q-pa-none">
          <div v-if="!$q.screen.lt.sm" class="col-6 row items-center justify-end">
            <q-btn
              @click="openFormNotification()"
              icon-right="add"
              label="Template"
              class="q-mr-sm bg-contabilidade"
              unelevated
              no-caps
            />
            <q-btn
              @click="openSendNotification"
              icon-right="send"
              label="Enviar"
              class="q-mr-sm bg-contabilidade"
              unelevated
              no-caps
            />
          </div>
        </q-card-section>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-table
          :rows="listTemplateCurrent"
          :rows-per-page-options="[rowsPerPage]"
          :columns="columnsTemplates"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhum template para mostrar"
          v-model:pagination="templatesSortPagination"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de templates</span>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="title" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.title }}</span>
              </q-td>
              <q-td key="text" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.text }}</span>
              </q-td>
              <q-td key="action" :props="props" class="text-left">
                <q-btn
                  @click="handleEdit(props.row)"
                  :disable="loadingTemplate"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
                <q-btn
                  @click="excludeTemplate(props.row.id)"
                  :disable="loadingTemplate"
                  size="sm"
                  flat
                  round
                  color="red"
                  icon="delete"
                />
              </q-td>
            </q-tr>
          </template>
          <template v-slot:bottom>
            <Paginate v-model="currentPage" :max="maxPages" :length="listTemplates.length" />
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="red" label="Fechar" size="md" @click="open = false" unelevated no-caps />
      </q-card-actions>
      <FormNotification
        :open="showFormNotification"
        :template="selectedData"
        @update:open="closeFormNotification"
      />
      <SendNotification :open="showSendNotification" @update:open="closeSendNotification" />
    </q-card>
  </q-dialog>
</template>
