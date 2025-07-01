<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import type { QuasarTable } from 'src/ts/interfaces/quasar/quasar';
import { useSubscriptionStore } from 'src/stores/subscription-store';
import { storeToRefs } from 'pinia';
import { formatToBr } from 'src/helpers/formatMoney';
import FormSubscription from 'src/components/forms/FormSubscription.vue';
import { useFeedbackStore } from 'src/stores/feedback-store';

defineOptions({
  name: 'Subscriptions',
});

const { listSubscription, loadingSubscription } = storeToRefs(useSubscriptionStore());

const showFormSubscription = ref<boolean>(false);
const dataEdit = ref<{ id: string; price: string; name: string } | null>(null);
const filterSubscription = ref<string>('');
const columnsSubscriptions = reactive<QuasarTable[]>([
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
    name: 'enterprises_using',
    label: 'Utilizando',
    field: 'enterprises_using',
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
  dataEdit.value = null;
};
const fetchSubscriptions = async () => {
  await useSubscriptionStore().getSubscriptions();
};
const closeFormSubscription = (): void => {
  showFormSubscription.value = false;
  clear();
};
const openFormSubscription = (): void => {
  showFormSubscription.value = true;
};
const handleEdit = (data: { id: string; price: string; name: string }): void => {
  dataEdit.value = data;
  openFormSubscription();
};

onMounted(async () => {
  clear();
  await fetchSubscriptions();
  await useFeedbackStore().getNotificationsFeedback();
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
    </header>
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm q-mb-md" :style="!$q.screen.lt.sm ? '' : 'width: 98vw'">
        <q-table
          :rows="listSubscription"
          :columns="columnsSubscriptions"
          :loading="loadingSubscription"
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
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="name" :props="props" class="text-left text-capitalize">
                {{ props.row.name }}
              </q-td>
              <q-td key="price" :props="props" class="text-left">
                {{ formatToBr(props.row.price) }}
              </q-td>
              <q-td key="enterprises_using" :props="props" class="text-left">
                {{ props.row.enterprises_using }}
              </q-td>
              <q-td key="created_at" :props="props" class="text-left">
                {{ props.row.created_at }}
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="handleEdit(props.row)"
                  v-show="props.row.name !== 'free'"
                  :disable="loadingSubscription"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </main>
    </q-scroll-area>
    <FormSubscription
      :open="showFormSubscription"
      :data="dataEdit"
      @update:open="closeFormSubscription"
    />
  </section>
</template>
