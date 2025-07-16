<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import type { QuasarSelect, QuasarTable } from 'src/ts/interfaces/quasar/quasar';
import { useCouponStore } from 'src/stores/coupon-store';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import type { Coupon, CouponEnterprise } from 'src/ts/interfaces/models/subscriptions';
import Paginate from '../general/Paginate.vue';

defineOptions({
  name: 'ChooseCoupon',
});

const props = defineProps<{
  open: boolean;
  enterprise: { id: string } | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { getCoupons } = useCouponStore();
const { loadingCoupon, listCoupon } = storeToRefs(useCouponStore());
const { setCoupon, removeCouponEnterprise, getCouponsInEnterprise } = useEnterpriseStore();
const { loadingEnterprise } = storeToRefs(useEnterpriseStore());

const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(10);
const filterAlert = ref<string>('');
const selectedCoupon = ref<QuasarSelect<string | null>>({
  label: 'Nenhum selecionado',
  value: null,
});
const showConfirmAction = ref<boolean>(false);
const selectedDataExclude = ref<string | null>(null);
const listCouponsEnterprise = reactive<CouponEnterprise[]>([]);
const filterCoupon = ref<string>('');
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
  selectedCoupon.value = {
    label: 'Nenhum selecionado',
    value: null,
  };
  selectedDataExclude.value = null;
  showConfirmAction.value = false;
  filterCoupon.value = '';
};
const resetPage = (): void => {
  currentPage.value = 1;
};
const fetchGetCouponsInEnterprise = async () => {
  const response = await getCouponsInEnterprise(props.enterprise?.id ?? '');
  if (response?.status === 200) {
    listCouponsEnterprise.splice(0, listCouponsEnterprise.length);
    response.data.coupons.map((item) => {
      listCouponsEnterprise.push(item);
    });
  }
};
const removeCoupon = async () => {
  const response = await removeCouponEnterprise(selectedDataExclude.value ?? '');
  if (response?.status === 200) {
    const arr = listCouponsEnterprise.filter((item) => item.id !== selectedDataExclude.value);
    listCouponsEnterprise.splice(0, listCouponsEnterprise.length);
    arr.forEach((item) => {
      listCouponsEnterprise.push(item);
    });
  }
};
const save = async () => {
  const response = await setCoupon(props.enterprise?.id ?? '', selectedCoupon.value.value);
  if (response?.status === 200) {
    await fetchGetCouponsInEnterprise();
    clear();
  }
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await removeCoupon();
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
const customFilterMembersEnterprise = (
  rows: readonly Coupon[],
  terms: string,
  cols: readonly Coupon[],
  getCellValue: (row: Coupon, col: QuasarTable) => unknown,
): readonly Coupon[] => {
  const searchTerm = terms.toLowerCase();
  resetPage();
  return listCoupon.value.filter((item) => {
    currentPage.value = 1;
    return item.name && item.name.toLowerCase().includes(searchTerm);
  });
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const optionsCoupons = computed(() => {
  const list = listCoupon.value.map((item) => {
    return {
      label: `${item.type == 'subscription' ? 'Plano' : 'Recurso'} | ${item.name}`,
      value: item.id,
    };
  });
  return [
    ...list,
    {
      label: 'Nenhum selecionado',
      value: null,
    },
  ];
});
const allowApply = computed(() => {
  if (selectedCoupon.value.value) {
    return true;
  }
  return false;
});
const listCouponEnterpriseCurrent = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return listCoupon.value.slice(start, end);
});
const maxPages = computed(() => {
  const filterLength = customFilterMembersEnterprise([], filterAlert.value, [], () => null).length;
  if (filterAlert.value.length > 0) {
    return Math.ceil(filterLength / rowsPerPage.value);
  }
  return Math.ceil(listCoupon.value.length / rowsPerPage.value);
});

watch(open, async () => {
  if (open.value) {
    clear();
    listCouponsEnterprise.splice(0, listCouponsEnterprise.length);
    await getCoupons();
    await fetchGetCouponsInEnterprise();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2" style="min-width: 90vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Cupons da organização" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm q-mb-sm">
          <q-select
            v-model="selectedCoupon"
            :options="optionsCoupons"
            label="Selecione o cupom"
            outlined
            dense
            options-dense
            bg-color="white"
            label-color="black"
            :readonly="loadingCoupon || loadingEnterprise"
          >
            <template v-slot:prepend>
              <q-icon name="percent" color="black" size="20px" />
            </template>
          </q-select>
        </q-form>
        <q-table
          :rows="listCouponEnterpriseCurrent"
          :columns="columnsCoupon"
          :filter="filterCoupon"
          :loading="loadingCoupon"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhum cupom para mostrar"
          virtual-scroll
          :rows-per-page-options="[rowsPerPage]"
          style="min-height: 300px"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de cupons da organização</span>
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
            <Paginate v-model="currentPage" :max="maxPages" :length="listCoupon.length" />
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            flat
            @click="open = false"
            unelevated
            no-caps
          />
          <q-btn
            @click="save"
            v-show="allowApply"
            color="primary"
            label="Aplicar"
            size="md"
            :loading="loadingCoupon || loadingEnterprise"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de desvínculo"
      message="Excluindo o cupom da organização, a mesma perderá as vantagens que o cupom oferece. Caso tenha certeza de que deseja excluir o cupom da organização, clique em 'Continuar'."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </q-dialog>
</template>
