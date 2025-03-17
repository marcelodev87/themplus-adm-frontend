<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { reactive, ref } from 'vue';
import type { QuasarSelect, QuasarTable } from 'src/ts/interfaces/quasar/quasar';

defineOptions({
  name: 'Activity',
});

const showRegisterDetail = ref<boolean>(false);
const filterRegister = ref<string>('');
const selectedDataView = ref<string | null>(null);
const selectedPeriod = ref<QuasarSelect<string>>({
  label: 'Últimos 60 dias',
  value: 'all',
});
const optionsFiltersPeriod = reactive<QuasarSelect<string>[]>([
  {
    label: 'Últimos 60 dias',
    value: 'all',
  },
  {
    label: 'Hoje',
    value: 'today',
  },
  {
    label: 'Ontem',
    value: 'yesterday',
  },
  {
    label: 'Últimos 15 dias',
    value: 'last15',
  },
  {
    label: 'Últimos 30 dias',
    value: 'last30',
  },
]);
const columnsRegister = reactive<QuasarTable[]>([
  {
    name: 'user_name',
    label: 'Nome',
    field: 'user_name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'user_email',
    label: 'Email',
    field: 'user_email',
    align: 'left',
    sortable: true,
  },
  {
    name: 'date',
    label: 'Data',
    field: 'date',
    align: 'left',
  },
  {
    name: 'type',
    label: 'Tipo',
    field: 'type',
    align: 'left',
  },
  {
    name: 'text',
    label: 'Descrição',
    field: 'text',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

// const clear = (): void => {
//   selectedDataView.value = null;
//   filterRegister.value = '';
// };
const openRegisterDetail = (): void => {
  showRegisterDetail.value = true;
};
const handleEdit = (id: string) => {
  selectedDataView.value = id;
  openRegisterDetail();
};
const buildAction = (action: string): string => {
  if (action === 'created') {
    return 'Criação';
  }
  if (action === 'insert') {
    return 'Inserção';
  }
  if (action === 'updated' || action === 'observations') {
    return 'Atualização';
  }
  if (action === 'deleted') {
    return 'Exclusão';
  }
  if (action === 'finalize' || action === 'finalized') {
    return 'Finalização';
  }
  if (action === 'transfer') {
    return 'Transferência';
  }
  if (action === 'reactivated') {
    return 'Reativação';
  }
  if (action === 'inactivated') {
    return 'Inativação';
  }
  if (action === 'delivered') {
    return 'Entrega';
  }
  if (action === 'invite') {
    return 'Solicitação';
  }
  if (action === 'unlink') {
    return 'Desvínculo';
  }
  if (action === 'undone') {
    return 'Reverção';
  }
  if (action === 'reopen') {
    return 'Reabertura';
  }

  return '';
};

// watch(selectedPeriod, async () => {
//   await fetchRegisters();
// });

// watch(
//   filledData,
//   () => {
//     if (!filledData.value) {
//       showAlertDataEnterprise.value = true;
//     }
//   },
//   { immediate: true },
// );

// onMounted(async () => {
//   await fetchRegisters();
// });
</script>
<template>
  <section>
    <header
      :class="
        !$q.screen.lt.sm
          ? 'row justify-between no-wrap bg-grey-1'
          : 'column justify-between no-wrap bg-grey-1'
      "
    >
      <div :class="!$q.screen.lt.sm ? 'col-5' : 'col-12'">
        <TitlePage title="Gerenciamento de registros" />
      </div>
      <div
        class="col-6 row items-center justify-end q-gutter-x-sm"
        :class="!$q.screen.lt.sm ? '' : 'q-mb-sm'"
      ></div>
    </header>
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm q-mb-md" :style="!$q.screen.lt.sm ? '' : 'width: 98vw'">
        <q-table
          :rows="[]"
          :columns="columnsRegister"
          :filter="filterRegister"
          :loading="false"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma alerta para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de registros</span>
            <q-space />
            <q-select
              v-model="selectedPeriod"
              :options="optionsFiltersPeriod"
              :readonly="false"
              label="Filtre um período"
              class="q-mr-sm"
              filled
              dense
              options-dense
              bg-color="grey-1"
              label-color="black"
              style="min-width: 200px"
              :class="!$q.screen.lt.md ? '' : 'full-width q-mt-sm'"
            >
              <template v-slot:prepend>
                <q-icon name="calendar_month" color="black" size="20px" />
              </template>
            </q-select>
            <q-input
              filled
              v-model="filterRegister"
              dense
              label="Pesquisar"
              :class="!$q.screen.lt.md ? '' : 'full-width q-mt-sm'"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="user_name" :props="props" class="text-left">
                {{ props.row.user_name }}
              </q-td>
              <q-td key="user_email" :props="props" class="text-left">
                {{ props.row.user_email }}
              </q-td>
              <q-td key="date" :props="props" class="text-left">
                {{ props.row.date }}
              </q-td>
              <q-td key="type" :props="props" class="text-left">
                {{ buildAction(props.row.action) }}
              </q-td>
              <q-td key="text" :props="props" class="text-left">
                {{ props.row.text }}
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="handleEdit(props.row.id)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="visibility"
                  :disable="false"
                >
                  <q-tooltip> Detalhes </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </main>
    </q-scroll-area>
  </section>
</template>
