<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import { storeToRefs } from 'pinia';
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormEnterprise from 'src/components/forms/FormEnterprise.vue';
import type { Enterprise } from 'src/ts/interfaces/models/enterprise';
import type { QuasarTable } from 'src/ts/interfaces/quasar/quasar';

defineOptions({
  name: 'Enterprise',
});

const { getEnterprises, deleteEnterprise } = useEnterpriseStore();
const { loadingEnterprise, listEnterprises } = storeToRefs(useEnterpriseStore());

const filterEnterprise = ref<string>('');
const showFormEnterprise = ref<boolean>(false);
const showConfirmAction = ref<boolean>(false);
const selectedDataEdit = ref<Enterprise | null>(null);
const selectedDataExclude = ref<string | null>(null);
const columnsEnterprise = reactive<QuasarTable[]>([
  {
    name: 'code_financial',
    label: 'Código interno',
    field: 'code_financial',
    align: 'left',
  },
  {
    name: 'name',
    label: 'Banco',
    field: 'name',
    align: 'left',
  },
  {
    name: 'position',
    label: 'Tipo',
    field: 'position',
    align: 'left',
  },
  {
    name: 'cnpj',
    label: 'CNPJ',
    field: 'cnpj',
    align: 'left',
  },
  {
    name: 'cpf',
    label: 'CPF',
    field: 'cpf',
    align: 'left',
  },
  {
    name: 'coupon',
    label: 'Cupom',
    field: 'coupon.name',
    align: 'left',
  },
  {
    name: 'created_at',
    label: 'Data de registro',
    field: 'created_at',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

const clear = (): void => {
  selectedDataEdit.value = null;
  selectedDataExclude.value = null;
  filterEnterprise.value = '';
};
const openFormEnterprise = (): void => {
  showFormEnterprise.value = true;
};
const closeFormEnterprise = (): void => {
  showFormEnterprise.value = false;
};
const fetchEnterprises = async () => {
  await getEnterprises();
};
const handleEdit = (data: Enterprise) => {
  selectedDataEdit.value = data;
  openFormEnterprise();
};
const exclude = async (id: string) => {
  await deleteEnterprise(id);
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await exclude(selectedDataExclude.value ?? '');
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: string): void => {
  selectedDataExclude.value = id;
  showConfirmAction.value = true;
};

onMounted(async () => {
  clear();
  await fetchEnterprises();
});
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
        <TitlePage title="Gerenciamento de organizações" />
      </div>
      <div v-if="!$q.screen.lt.sm" class="col-6 row items-center justify-end q-gutter-x-sm">
        <q-btn
          @click="openFormEnterprise"
          icon-right="add"
          label="Organização"
          class="q-mr-sm bg-contabilidade"
          unelevated
          no-caps
        />
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm q-mb-md" :style="!$q.screen.lt.sm ? '' : 'width: 98vw'">
        <q-table
          :rows="listEnterprises"
          :columns="columnsEnterprise"
          :filter="filterEnterprise"
          :loading="loadingEnterprise"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma organização para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de organizações</span>
            <q-space />
            <q-input filled v-model="filterEnterprise" dense label="Pesquisar">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="code_financial" :props="props" class="text-left">
                {{ props.row.code_financial }}
              </q-td>
              <q-td key="name" :props="props" class="text-left">
                {{ props.row.name }}
              </q-td>
              <q-td key="cnpj" :props="props" class="text-left">
                {{ props.row.cnpj }}
              </q-td>
              <q-td key="cpf" :props="props" class="text-left">
                {{ props.row.cpf }}
              </q-td>
              <q-td key="coupon" :props="props" class="text-left">
                {{ props.row.coupon }}
              </q-td>
              <q-td key="created_at" :props="props" class="text-left">
                {{ props.row.created_at }}
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="handleEdit(props.row)"
                  :disable="loadingEnterprise"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
                <q-btn
                  @click="openConfirmAction(props.row.id)"
                  :disable="loadingEnterprise"
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
      </main>
    </q-scroll-area>
    <FormEnterprise :open="showFormEnterprise" mode="office" @update:open="closeFormEnterprise" />
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão"
      message="Excluindo a organização, será apagado tudo que esteja vinculado a mesma. Caso tenha certeza de que deseja excluir a organização, clique em 'Continuar'."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>
