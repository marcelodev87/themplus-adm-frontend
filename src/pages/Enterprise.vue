<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import { storeToRefs } from 'pinia';
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormEnterprise from 'src/components/forms/FormEnterprise.vue';
import type { Enterprise } from 'src/ts/interfaces/models/enterprise';
import type { QuasarTable, QuasarSelect } from 'src/ts/interfaces/quasar/quasar';
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';
import ChooseCoupon from 'src/components/shared/ChooseCoupon.vue';
import MemberManage from 'src/components/manage/MemberManage.vue';
import NotificationManagement from 'src/components/manage/NotificationManage.vue';
import { useFeedbackStore } from 'src/stores/feedback-store';

defineOptions({
  name: 'Enterprise',
});

const { getEnterprises, deleteEnterprise } = useEnterpriseStore();
const { loadingEnterprise, listEnterprises } = storeToRefs(useEnterpriseStore());

const filterEnterprise = ref<string>('');
const selectCoupon = ref<QuasarSelect<string>>({
  label: 'Todos',
  value: 'all',
});
const chooseCouponData = ref<{ id: string } | null>(null);
const showChooseCoupon = ref<boolean>(false);
const showFormEnterprise = ref<boolean>(false);
const showConfirmAction = ref<boolean>(false);
const showManageMembers = ref<boolean>(false);
const selectedEnterprise = ref<string | null>(null);
const showNotificationManagement = ref<boolean>(false);
const selectedDataEdit = ref<Enterprise | null>(null);
const selectedDataExclude = ref<string | null>(null);
const columnsEnterprise = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Organização',
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
    name: 'document',
    label: 'Documento',
    field: '',
    align: 'left',
  },
  {
    name: 'coupon',
    label: 'Cupons',
    field: '',
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
  selectCoupon.value = {
    label: 'Todos',
    value: 'all',
  };
};
const openFormEnterprise = (): void => {
  showFormEnterprise.value = true;
};
const closeFormEnterprise = (): void => {
  showFormEnterprise.value = false;
  clear();
};
const openNotificationManagement = (): void => {
  showNotificationManagement.value = true;
};
const closeNotificationManagement = (): void => {
  showNotificationManagement.value = false;
};
const openChooseCoupon = (data: Enterprise): void => {
  chooseCouponData.value = {
    id: data.id,
  };
  showChooseCoupon.value = true;
};
const closeChooseCoupon = (): void => {
  showChooseCoupon.value = false;
  chooseCouponData.value = null;
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
const openMembersEnterprise = (id: string): void => {
  selectedEnterprise.value = id;
  showManageMembers.value = true;
};
const closeMembersEnterprise = (): void => {
  showManageMembers.value = false;
};
const customFilterEnterprise = (
  rows: readonly Enterprise[],
  terms: string,
  cols: readonly Enterprise[],
  getCellValue: (row: Enterprise, col: QuasarTable) => unknown,
): readonly Enterprise[] => {
  const searchTerm = terms.toLowerCase();

  return rows.filter((item) => {
    return (
      (item.name && item.name.toLowerCase().includes(searchTerm)) ||
      (item.cpf && item.cpf.toLowerCase().includes(searchTerm)) ||
      (item.cnpj && item.cnpj.toLowerCase().includes(searchTerm))
    );
  });
};

watch(showManageMembers, async () => {
  if (!showManageMembers.value) {
    clear();
    await fetchEnterprises();
  }
});

onMounted(async () => {
  clear();
  await fetchEnterprises();
  await useFeedbackStore().getcountFeedbacks();
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
        <div>
          <q-btn
            @click="openNotificationManagement"
            icon-right="add"
            label="Notificaçoes"
            class="q-mr-sm bg-contabilidade"
            unelevated
            no-caps
          />
        </div>
        <div>
          <q-btn
            @click="openFormEnterprise"
            icon-right="add"
            label="Organização"
            class="q-mr-sm bg-contabilidade"
            unelevated
            no-caps
          />
        </div>
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm q-mb-md" :style="!$q.screen.lt.sm ? '' : 'width: 98vw'">
        <q-table
          :rows="listEnterprises"
          :columns="columnsEnterprise"
          :filter="filterEnterprise"
          :loading="loadingEnterprise"
          :filter-method="customFilterEnterprise"
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
              <q-td key="name" :props="props" class="text-left">
                {{ props.row.name }}
              </q-td>
              <q-td key="position" :props="props" class="text-left">
                {{ props.row.position == 'client' ? 'Cliente' : 'Contador' }}
              </q-td>
              <q-td key="document" :props="props" class="text-left">
                {{
                  props.row.cnpj
                    ? `CNPJ: ${props.row.cnpj ?? 'Não definido'}`
                    : `CPF: ${props.row.cpf ?? 'Não definido'}`
                }}
              </q-td>
              <q-td key="coupon" :props="props" class="text-left">
                {{}}
                <q-badge
                  rounded
                  :color="props.row.coupons.length > 0 ? 'green' : 'red'"
                  :label="props.row.coupons.length"
                />
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="openMembersEnterprise(props.row.id)"
                  :disable="loadingEnterprise"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="person"
                >
                  <q-tooltip>Members</q-tooltip>
                </q-btn>
                <q-btn
                  @click="openChooseCoupon(props.row)"
                  :disable="loadingEnterprise"
                  size="sm"
                  flat
                  round
                  color="primary"
                  icon="sell"
                >
                  <q-tooltip>Cupons</q-tooltip>
                </q-btn>
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
    <MemberManage
      :open="showManageMembers"
      :enterprise-id="selectedEnterprise"
      @update:open="closeMembersEnterprise"
    />
    <FormEnterprise
      :open="showFormEnterprise"
      :data="selectedDataEdit"
      mode="office"
      @update:open="closeFormEnterprise"
    />
    <NotificationManagement
      :open="showNotificationManagement"
      @update:open="closeNotificationManagement"
    />
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão"
      message="Excluindo a organização, será apagado tudo que esteja vinculado a mesma. Caso tenha certeza de que deseja excluir a organização, clique em 'Continuar'."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
    <ChooseCoupon
      :open="showChooseCoupon"
      :enterprise="chooseCouponData"
      @update:open="closeChooseCoupon"
    />
  </section>
</template>
