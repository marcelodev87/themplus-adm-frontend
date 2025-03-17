<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import type { QuasarTable } from 'src/ts/interfaces/quasar/quasar';
import { useCouponStore } from 'src/stores/coupon-store';
import { storeToRefs } from 'pinia';
import FormCoupon from 'src/components/forms/FormCoupon.vue';

defineOptions({
  name: 'Coupon',
});

const { loadingCoupon, listCoupon } = storeToRefs(useCouponStore());

const filterCoupon = ref<string>('');
const showFormCoupon = ref<boolean>(false);
const showConfirmAction = ref<boolean>(false);
const selectedDataEdit = ref<string | null>(null);
const selectedDataExclude = ref<string | null>(null);
const columnsCoupon = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'enterprises_using',
    label: 'Utilizando',
    field: 'enterprises_using',
    align: 'left',
  },
  {
    name: 'created_at',
    label: 'Data de criação',
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
  filterCoupon.value = '';
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
          :rows="listCoupon"
          :columns="columnsCoupon"
          :filter="filterCoupon"
          :loading="loadingCoupon"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhum cupom para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
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
              <q-td key="name" :props="props" class="text-left">
                {{ props.row.name }}
              </q-td>
              <q-td key="enterprises_using" :props="props" class="text-left">
                {{ props.row.enterprises_using }}
              </q-td>
              <q-td key="created_at" :props="props" class="text-left">
                {{ props.row.created_at }}
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="handleEdit(props.row.id)"
                  :disable="false"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
                <q-btn
                  @click="openConfirmAction(props.row.id)"
                  :disable="false"
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
    <FormCoupon :open="showFormCoupon" :data-id="selectedDataEdit" @update:open="closeFormCoupon" />
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão"
      message="Excluindo o cupom, as organizações que estiverem vinculadas poderão serem afetadas. Caso tenha certeza de que deseja excluir a organização, clique em 'Continuar'."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>
