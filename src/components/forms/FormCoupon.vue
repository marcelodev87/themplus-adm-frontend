<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { useCouponStore } from 'src/stores/coupon-store';
import { storeToRefs } from 'pinia';
import type { CouponData } from 'src/ts/interfaces/models/subscriptions';
import { checkDataCoupon } from 'src/helpers/checkData';
import type { QuasarSelect } from 'src/ts/interfaces/quasar/quasar';

defineOptions({
  name: 'FormCoupon',
});

const props = defineProps<{
  open: boolean;
  dataId: string | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingCoupon } = storeToRefs(useCouponStore());

const showExpired = ref<string>('Não');
const showDiscount = ref<boolean>(false);
const selectedTypeCoupon = ref<QuasarSelect<string>>({
  label: 'Plano',
  value: 'subscription',
});
const selectedResource = ref<QuasarSelect<string>>({
  label: 'Movimentações +100',
  value: 'mv100',
});
const selectedSubscription = ref<QuasarSelect<string>>({
  label: 'Plano básico',
  value: 'basic',
});
const dataCoupon = reactive({
  name: '' as string,
  discount: '' as string,
  dateExpiration: '' as string,
});
const optionsTypeCoupon = reactive([
  {
    label: 'Plano',
    value: 'subscription',
  },
  {
    label: 'Recurso',
    value: 'resource',
  },
]);
const optionsResource = reactive([
  {
    label: 'Movimentações +100',
    value: 'mv100',
  },
  {
    label: 'Movimentações +200',
    value: 'mv200',
  },
  {
    label: 'Movimentações +1000',
    value: 'mv1000',
  },
  {
    label: 'Membros +100',
    value: 'mb100',
  },
  {
    label: 'Membros +200',
    value: 'mb200',
  },
  {
    label: 'Membros +1000',
    value: 'mb1000',
  },
]);
const optionsSubscription = reactive([
  {
    label: 'Plano básico',
    value: 'basic',
  },
  {
    label: 'Plano avançado',
    value: 'advanced',
  },
]);

const clear = (): void => {
  Object.assign(dataCoupon, {
    name: '',
    dateExpiration: '',
    discount: '',
  });
  showExpired.value = 'Não';
  showDiscount.value = false;
  selectedTypeCoupon.value = {
    label: 'Plano',
    value: 'subscription',
  };
  selectedResource.value = {
    label: 'Movimentações +100',
    value: 'mv100',
  };
  selectedSubscription.value = {
    label: 'Plano básico',
    value: 'basic',
  };
};
const save = async () => {
  const check = checkDataCoupon(dataCoupon, showExpired.value);
  if (check.status) {
    const response = await useCouponStore().createCoupon(
      dataCoupon.name,
      selectedTypeCoupon.value.value,
      selectedTypeCoupon.value.value === 'subscription' ? selectedSubscription.value.value : null,
      selectedTypeCoupon.value.value === 'resource' ? selectedResource.value.value : null,
      dataCoupon.discount.trim() !== '' ? Number(dataCoupon.discount) : null,
      dataCoupon.dateExpiration.trim() !== '' ? dataCoupon.dateExpiration : null,
    );
    if (response?.status === 200) {
      clear();
      emit('update:open');
    }
  } else {
    Notify.create({
      message: check.message || 'Erro ao criar cupom',
      type: 'negative',
    });
  }
};
const update = async () => {
  const check = checkDataCoupon(dataCoupon, showExpired.value);
  if (check.status) {
    const response = await useCouponStore().updateCoupon(
      props.dataId ?? '',
      dataCoupon.name,
      selectedTypeCoupon.value.value,
      selectedTypeCoupon.value.value === 'subscription' ? selectedSubscription.value.value : null,
      selectedTypeCoupon.value.value === 'resource' ? selectedResource.value.value : null,
      dataCoupon.discount.trim() !== '' ? Number(dataCoupon.discount) : null,
      dataCoupon.dateExpiration.trim() !== '' ? dataCoupon.dateExpiration : null,
    );
    if (response?.status === 200) {
      clear();
      emit('update:open');
    }
  } else {
    Notify.create({
      message: check.message || 'Erro ao atualizar cupom',
      type: 'negative',
    });
  }
};
const mountEdit = (coupon: CouponData): void => {
  Object.assign(dataCoupon, {
    name: coupon.name,
    discount: coupon.discount,
    dateExpiration: coupon.date_expiration ?? '',
  });
};
const checkDataEdit = async () => {
  if (props.dataId) {
    const response = await useCouponStore().getCoupon(props.dataId);
    if (response?.status === 200) {
      mountEdit(response.data.coupon);
    }
  }
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(
  () => dataCoupon.discount,
  (discount) => {
    dataCoupon.discount = discount.replace(/^0+/, '');
  },
);
watch(showDiscount, () => {
  dataCoupon.discount = '';
});
watch(showExpired, () => {
  if (showExpired.value == 'Não') {
    dataCoupon.dateExpiration = '';
  }
});
watch(
  () => dataCoupon.discount,
  (discount) => {
    if (Number(discount) > 100) {
      dataCoupon.discount = '100';
    }
  },
);
watch(open, async () => {
  if (open.value) {
    clear();
    await checkDataEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage :title="props.dataId ? 'Atualize o cupom' : 'Registre um cupom'" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataCoupon.name"
            bg-color="white"
            label-color="black"
            outlined
            label="Nome do cupom"
            dense
            input-class="text-black"
            maxlength="40"
            :readonly="loadingCoupon"
          >
            <template v-slot:prepend>
              <q-icon name="sell" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-model="selectedTypeCoupon"
            :options="optionsTypeCoupon"
            label="Tipo de cupom"
            outlined
            dense
            options-dense
            bg-color="white"
            label-color="black"
            :readonly="loadingCoupon"
          >
            <template v-slot:prepend>
              <q-icon name="fact_check" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            v-if="selectedTypeCoupon.value === 'resource'"
            v-model="selectedResource"
            :options="optionsResource"
            label="Recurso"
            outlined
            dense
            options-dense
            bg-color="white"
            label-color="black"
            :readonly="loadingCoupon"
          >
            <template v-slot:prepend>
              <q-icon name="check_circle" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            v-else
            v-model="selectedSubscription"
            :options="optionsSubscription"
            label="Plano"
            outlined
            dense
            options-dense
            bg-color="white"
            label-color="black"
            :readonly="loadingCoupon"
          >
            <template v-slot:prepend>
              <q-icon name="check_circle" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataCoupon.discount"
            bg-color="white"
            label-color="black"
            outlined
            label="Desconto"
            dense
            input-class="text-black"
            mask="###"
            :readonly="loadingCoupon"
          >
            <template v-slot:prepend>
              <q-icon name="percent" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-model="showExpired"
            :options="['Sim', 'Não']"
            label="Data de expiração"
            outlined
            dense
            options-dense
            bg-color="white"
            label-color="black"
            :readonly="loadingCoupon"
          >
            <template v-slot:prepend>
              <q-icon name="calendar_month" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataCoupon.dateExpiration"
            bg-color="white"
            label-color="black"
            outlined
            label="Data de expiração"
            dense
            input-class="text-black"
            mask="##/##/####"
            :readonly="loadingCoupon"
            :disable="showExpired == 'Não'"
          >
            <template v-slot:prepend>
              <q-icon name="event" color="black" size="20px" />
            </template>
          </q-input>
        </q-form>
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
            v-if="!props.dataId"
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="loadingCoupon"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingCoupon"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
