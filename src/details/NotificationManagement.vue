<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import FormNotification from 'src/components/forms/FormNotification.vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { useTemplateNotificationStore } from 'src/stores/template-notification-store';
import type { TemplateNotification } from 'src/ts/interfaces/models/template-notification';
import type { QuasarTable } from 'src/ts/interfaces/quasar/quasar';
import { computed, reactive, ref, watch } from 'vue';
import SendNotification from './SendNotification.vue';

defineOptions({
  name: 'NotificationManagement',
});

const { getTemplates, deleteTemplate } = useTemplateNotificationStore();
const { loadingTemplate, listTemplates } = storeToRefs(useTemplateNotificationStore());

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

const columnsTemplates = reactive<QuasarTable[]>([
  {
    name: 'title',
    label: 'Título',
    field: 'title',
    align: 'left',
  },
  {
    name: 'text',
    label: 'Messagem',
    field: 'text',
    align: 'left',
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
        <TitlePage title="Gerenciamento de Notificações" />
        <q-card-section class="q-pa-none">
          <div v-if="!$q.screen.lt.sm" class="col-6 row items-center justify-end q-gutter-x-sm">
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
      <q-card-section>
        <q-table
          :rows="listTemplates"
          :rows-per-page-options="[10]"
          :columns="columnsTemplates"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhum template para mostrar"
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
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="red" label="Fechar" size="md" flat @click="open = false" unelevated no-caps />
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
