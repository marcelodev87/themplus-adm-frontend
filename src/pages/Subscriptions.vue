<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import type { QuasarTable } from 'src/ts/interfaces/quasar/quasar';

defineOptions({
  name: 'Subscriptions',
});

const filterSubscription = ref<string>('');
const columnsCoupon = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'price',
    label: 'Preço',
    field: 'price',
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
  filterSubscription.value = '';
};

onMounted(() => {
  clear();
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
        <TitlePage title="Gerenciamento de assinaturas" />
      </div>
      <div v-if="!$q.screen.lt.sm" class="col-6 row items-center justify-end q-gutter-x-sm">
        <q-btn
          icon-right="add"
          label="Assinatura"
          class="q-mr-sm bg-contabilidade"
          unelevated
          no-caps
        />
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm q-mb-md" :style="!$q.screen.lt.sm ? '' : 'width: 98vw'">
        <q-table
          :rows="[]"
          :columns="columnsCoupon"
          :filter="filterSubscription"
          :loading="false"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma assinatura para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de assinaturas</span>
            <q-space />
            <q-input filled v-model="filterSubscription" dense label="Pesquisar">
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
                {{ props.row.price }}
              </q-td>
              <q-td key="created_at" :props="props" class="text-left">
                {{ props.row.created_at }}
              </q-td>
              <q-td key="action" :props="props">
                <q-btn :disable="false" size="sm" flat round color="black" icon="edit" />
                <q-btn :disable="false" size="sm" flat round color="red" icon="delete" />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </main>
    </q-scroll-area>
  </section>
</template>
