<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import type { QuasarTable } from 'src/ts/interfaces/quasar/quasar';
import { useCouponStore } from 'src/stores/coupon-store';
import { storeToRefs } from 'pinia';
import FormCoupon from 'src/components/forms/FormCoupon.vue';
import { formatDate } from 'src/helpers/formatDate';
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';
import type { CouponTable } from 'src/ts/interfaces/models/subscriptions';
import Paginate from 'src/components/general/Paginate.vue';

defineOptions({
  name: 'Coupon',
});

const { loadingCoupon, listCoupon } = storeToRefs(useCouponStore());

const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(11);
const filterCoupon = ref<string>('');
const showFormCoupon = ref<boolean>(false);
const showConfirmAction = ref<boolean>(false);
const selectedDataEdit = ref<string | null>(null);
const selectedDataExclude = ref<string | null>(null);
const columnsCoupon = reactive<QuasarTable[]>([
  {
    name: 'type',
    label: 'Tipo',
    field: 'type',
    align: 'left',
  },
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'code',
    label: 'Código',
    field: 'code',
    align: 'left',
  },
  {
    name: 'enterprises_using',
    label: 'Utilização',
    field: 'enterprises_using',
    align: 'center',
  },
  {
    name: 'created_at',
    label: 'Data de criação',
    field: 'created_at',
    align: 'center',
  },
  {
    name: 'date_expiration',
    label: 'Data de expiração',
    field: 'date_expiration',
    align: 'center',
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
  filterCoupon.value = '';
};
const resetPage = (): void => {
  currentPage.value = 1;
};
const openFormCoupon = (): void => {
  showFormCoupon.value = true;
};
const closeFormCoupon = (): void => {
  showFormCoupon.value = false;
  clear();
};
const fetchCoupons = async () => {
  await useCouponStore().getCoupons();
};
const handleEdit = (id: string) => {
  selectedDataEdit.value = id;
  openFormCoupon();
};
const exclude = async (id: string) => {
  await useCouponStore().deleteCoupon(id);
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
const getClassLimit = (data: CouponTable) => {
  if (data.limit) {
    if (data.using >= data.limit) {
      return 'text-red';
    } else {
      return 'text-green';
    }
  } else {
    return 'text-blue';
  }
};
const getExpirationColor = (dateExpiration: string | null): string => {
  if (dateExpiration) {
    const parts = dateExpiration.split('/') as [string, string, string];
    if (parts.length !== 3) {
      return 'text-grey';
    }
    const [day, month, year] = parts;

    const expiration = new Date(+year, +month - 1, +day);
    const today = new Date();

    expiration.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (expiration.getTime() === today.getTime()) {
      return 'text-orange';
    } else if (expiration < today) {
      return 'text-red';
    } else {
      return 'text-green';
    }
  } else {
    return 'text-grey';
  }
};
const filteredCoupon = computed(() => {
  const normalize = (text: string): string => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };
  const searchTerm = normalize(filterCoupon.value);
  resetPage();
  return listCoupon.value.filter((item) => {
    return item.name && normalize(item.name).includes(searchTerm);
  });
});

const listCouponCurrent = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return filteredCoupon.value.slice(start, end);
});
const maxPages = computed(() => {
  return Math.ceil(filteredCoupon.value.length / rowsPerPage.value);
});

onMounted(async () => {
  clear();
  await fetchCoupons();
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
        <TitlePage title="Gerenciamento de cupons" />
      </div>
      <div v-if="!$q.screen.lt.sm" class="col-6 row items-center justify-end q-gutter-x-sm">
        <q-btn
          @click="openFormCoupon"
          icon-right="add"
          label="Cupom"
          class="q-mr-sm bg-contabilidade"
          unelevated
          no-caps
        />
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm q-mb-md" :style="!$q.screen.lt.sm ? '' : 'width: 98vw'">
        <q-table
          :rows="listCouponCurrent"
          :columns="columnsCoupon"
          :loading="loadingCoupon"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhum cupom para mostrar"
          virtual-scroll
          :rows-per-page-options="[rowsPerPage]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de cupons</span>
            <q-space />
            <q-input filled v-model="filterCoupon" dense label="Pesquisar">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="type" :props="props" class="text-left">
                {{ props.row.type == 'subscription' ? 'Plano' : 'Recurso' }}
              </q-td>
              <q-td key="name" :props="props" class="text-left">
                {{ props.row.name }}
              </q-td>
              <q-td key="code" :props="props" class="text-left">
                {{ props.row.code }}
              </q-td>
              <q-td
                key="enterprises_using"
                :props="props"
                class="text-center"
                :class="getClassLimit(props.row)"
              >
                {{ props.row.using }} / {{ props.row.limit ?? '&infin;' }}
                <q-icon name="info" color="grey" size="14px" class="q-ml-md">
                  <q-tooltip class="bg-grey-2">
                    <div class="text-bold" v-show="getClassLimit(props.row) == 'text-green'">
                      <span class="text-green">Verde: </span>
                      <span class="text-grey"
                        >Seu cupom tendo limite para usos e a utilização não chegou na quantidade
                        disponibilizada</span
                      >
                    </div>
                    <div class="text-bold" v-show="getClassLimit(props.row) == 'text-blue'">
                      <span class="text-blue text-bold">Azul: </span>
                      <span class="text-grey">Seu cupom não tem limite para utilização</span>
                    </div>
                    <div class="text-bold" v-show="getClassLimit(props.row) == 'text-red'">
                      <span class="text-red text-bold">Vermelho: </span>
                      <span class="text-grey"
                        >Seu cupom tendo utilizado todo seu limite de quantidade
                        disponibilizada</span
                      >
                    </div>
                  </q-tooltip>
                </q-icon>
              </q-td>
              <q-td key="created_at" :props="props" class="text-center">
                {{ formatDate(props.row.created_at) }}
              </q-td>
              <q-td
                key="date_expiration"
                :props="props"
                class="text-center"
                :class="getExpirationColor(props.row.date_expiration)"
              >
                {{ props.row.date_expiration }}
                <q-icon
                  v-show="props.row.date_expiration"
                  name="info"
                  color="grey"
                  size="14px"
                  class="q-ml-md"
                >
                  <q-tooltip class="bg-grey-2">
                    <div
                      class="text-bold"
                      v-show="getExpirationColor(props.row.date_expiration) == 'text-green'"
                    >
                      <span class="text-green">Verde: </span>
                      <span class="text-grey"
                        >A data de expiração está dentro do prazo ou não tem data de expiração</span
                      >
                    </div>
                    <div
                      class="text-bold"
                      v-show="getExpirationColor(props.row.date_expiration) == 'text-orange'"
                    >
                      <span class="text-orange">Laranja: </span>
                      <span class="text-grey">A data de expiração está para hoje</span>
                    </div>
                    <div
                      class="text-bold"
                      v-show="getExpirationColor(props.row.date_expiration) == 'text-red'"
                    >
                      <span class="text-red">Vermelho: </span>
                      <span class="text-grey">A data de expiração já ultrapassou a data atual</span>
                    </div>
                  </q-tooltip>
                </q-icon>
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="handleEdit(props.row.id)"
                  :disable="loadingCoupon"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
                <q-btn
                  @click="openConfirmAction(props.row.id)"
                  :disable="loadingCoupon"
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
            <Paginate v-model="currentPage" :max="maxPages" :length="filteredCoupon.length" />
          </template>
        </q-table>
      </main>
    </q-scroll-area>
    <FormCoupon :open="showFormCoupon" :data-id="selectedDataEdit" @update:open="closeFormCoupon" />
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão"
      message="Excluindo o cupom, as organizações que estiverem vinculadas poderão serem afetadas. Caso tenha certeza de que deseja excluir o cupom, clique em 'Continuar'."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>
