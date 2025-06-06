<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { useCouponStore } from 'src/stores/coupon-store';
import { storeToRefs } from 'pinia';
import type { CouponData } from 'src/ts/interfaces/models/subscriptions';
import { checkDataCoupon } from 'src/helpers/checkData';
import type { QuasarSelect } from 'src/ts/interfaces/quasar/quasar';
import { useResourceStore } from 'src/stores/resource-store';
import { useSubscriptionStore } from 'src/stores/subscription-store';

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
const { loadingResource, listResource } = storeToRefs(useResourceStore());
const { listSubscription, loadingSubscription } = storeToRefs(useSubscriptionStore());

const subscriptions = reactive<{ id: string; name: string }[]>([]);
const showExpired = ref<'Sim' | 'Não'>('Não');
const showLimit = ref<'Sim' | 'Não'>('Não');
const selectedTypeCoupon = ref<QuasarSelect<string>>({
  label: 'Plano',
  value: 'subscription',
});
const selectedResource = ref<QuasarSelect<string>>({
  label: '',
  value: '',
});
const selectedSubscription = ref<QuasarSelect<string>>({
  label: '',
  value: '',
});
const dataCoupon = reactive({
  name: '' as string,
  code: '' as string,
  discount: '' as string,
  dateExpiration: '' as string,
  limit: '' as string,
  description: '' as string,
});
const optionsTypeCoupon = reactive([
  {
    label: 'Plano',
    value: 'subscription',
  },
  {
    label: 'Recurso',
    value: 'service',
  },
]);

const clear = (): void => {
  Object.assign(dataCoupon, {
    name: '',
    dateExpiration: '',
    discount: '',
    limit: '',
    description: '',
    code: '',
  });
  showExpired.value = 'Não';
  showLimit.value = 'Não';
  selectedTypeCoupon.value = {
    label: 'Plano',
    value: 'subscription',
  };
  selectedResource.value = {
    label: '',
    value: '',
  };
  selectedSubscription.value = {
    label: '',
    value: '',
  };
};
const save = async () => {
  const check = checkDataCoupon(dataCoupon, showExpired.value);
  if (check.status) {
    const response = await useCouponStore().createCoupon(
      dataCoupon.name,
      selectedTypeCoupon.value.value,
      selectedTypeCoupon.value.value === 'subscription' ? selectedSubscription.value.value : null,
      selectedTypeCoupon.value.value === 'service' ? selectedResource.value.value : null,
      dataCoupon.discount.trim() !== '' ? Number(dataCoupon.discount) : null,
      dataCoupon.dateExpiration.trim() !== '' ? dataCoupon.dateExpiration : null,
      dataCoupon.limit.trim() !== '' ? Number(dataCoupon.limit) : null,
      dataCoupon.description.trim() !== '' ? dataCoupon.description : null,
      dataCoupon.code,
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
      selectedTypeCoupon.value.value === 'service' ? selectedResource.value.value : null,
      dataCoupon.discount.trim() !== '' ? Number(dataCoupon.discount) : null,
      dataCoupon.dateExpiration.trim() !== '' ? dataCoupon.dateExpiration : null,
      dataCoupon.limit.trim() !== '' ? Number(dataCoupon.limit) : null,
      dataCoupon.description.trim() !== '' ? dataCoupon.description : null,
      dataCoupon.code,
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
const setOptions = (coupon: CouponData): void => {
  if (coupon.type === 'subscription') {
    selectedTypeCoupon.value = {
      label: 'Plano',
      value: 'subscription',
    };

    const subscription = subscriptions.find((item) => item.id === coupon.subscription_id);
    selectedSubscription.value = {
      label: subscription?.name == 'basic' ? 'Plano básico' : 'Plano avançado',
      value: subscription?.name == 'basic' ? 'basic' : 'advanced',
    };
  } else {
    selectedTypeCoupon.value = {
      label: 'Recurso',
      value: 'service',
    };
    const resource = listResource.value.find((item) => item.value == coupon.service_id);
    selectedResource.value = {
      label: resource?.label ?? '',
      value: resource?.value ?? '',
    };
  }

  if (coupon.date_expiration) {
    showExpired.value = 'Sim';
  }
  if (coupon.limit || coupon.limit == 0) {
    showLimit.value = 'Sim';
  }
};
const mountEdit = (coupon: CouponData): void => {
  Object.assign(dataCoupon, {
    name: coupon.name,
    limit: coupon.limit || coupon.limit == 0 ? String(coupon.limit) : '',
    code: coupon.code,
    discount: String(coupon.discount),
    dateExpiration: coupon.date_expiration ?? '',
    description: coupon.description ?? '',
  });

  setOptions(coupon);
};
const checkDataEdit = async () => {
  if (props.dataId) {
    const response = await useCouponStore().getCoupon(props.dataId);
    if (response?.status === 200) {
      mountEdit(response.data.coupon);
    }
  }
};
const fetchService = async () => {
  await useResourceStore().getResources();
  selectedResource.value = listResource.value[0] ?? { label: '', value: '' };
};
const fetchSubscriptions = async () => {
  await useSubscriptionStore().getSubscriptions();
  selectedSubscription.value =
    listSubscription.value.length > 0
      ? {
          label: listSubscription.value[0]?.name ?? '',
          value: listSubscription.value[0]?.id ?? '',
        }
      : { label: '', value: '' };
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const optionsSubscriptions = computed(() => {
  return listSubscription.value.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
});

watch(showExpired, () => {
  if (showExpired.value == 'Não') {
    dataCoupon.dateExpiration = '';
  }
});
watch(showLimit, () => {
  if (showLimit.value == 'Não') {
    dataCoupon.limit = '';
  }
});
watch(
  () => dataCoupon.discount,
  (discount) => {
    if (dataCoupon.discount.trim() !== '') {
      dataCoupon.discount = discount.replace(/^0+/, '');
    }
    if (Number(discount) > 100) {
      dataCoupon.discount = '100';
    }
  },
);
watch(
  () => dataCoupon.code,
  (code) => {
    if (code.trim() !== '') {
      dataCoupon.code = code.replace(/\s+/g, '').toUpperCase();
    }
  },
);
watch(open, async () => {
  if (open.value) {
    clear();
    await checkDataEdit();
    await fetchService();
    await fetchSubscriptions();
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
            :readonly="loadingCoupon || loadingResource || loadingSubscription"
          >
            <template v-slot:prepend>
              <q-icon name="sell" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataCoupon.code"
            bg-color="white"
            label-color="black"
            outlined
            label="Código do cupom"
            dense
            input-class="text-black"
            maxlength="40"
            :readonly="
              loadingCoupon || loadingResource || props.dataId !== null || loadingSubscription
            "
          >
            <template v-slot:prepend>
              <q-icon name="code" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataCoupon.description"
            bg-color="white"
            label-color="black"
            outlined
            label="Descrição"
            dense
            input-class="text-black"
            maxlength="200"
            :readonly="loadingCoupon || loadingResource || loadingSubscription"
          >
            <template v-slot:prepend>
              <q-icon name="description" color="black" size="20px" />
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
            :readonly="
              loadingCoupon || loadingResource || loadingSubscription || props.dataId !== null
            "
          >
            <template v-slot:prepend>
              <q-icon name="fact_check" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            v-if="selectedTypeCoupon.value === 'service'"
            v-model="selectedResource"
            :options="listResource"
            label="Recurso"
            outlined
            dense
            options-dense
            bg-color="white"
            label-color="black"
            :readonly="
              loadingCoupon || loadingResource || loadingSubscription || props.dataId !== null
            "
          >
            <template v-slot:prepend>
              <q-icon name="check_circle" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            v-else
            v-model="selectedSubscription"
            :options="optionsSubscriptions"
            label="Plano"
            outlined
            dense
            options-dense
            bg-color="white"
            label-color="black"
            :readonly="
              loadingCoupon || loadingResource || loadingSubscription || props.dataId !== null
            "
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
            :readonly="
              loadingCoupon || loadingResource || loadingSubscription || props.dataId !== null
            "
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
            :readonly="
              loadingCoupon || loadingResource || loadingSubscription || props.dataId !== null
            "
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
            :readonly="
              loadingCoupon || loadingResource || loadingSubscription || props.dataId !== null
            "
            :disable="showExpired == 'Não'"
          >
            <template v-slot:prepend>
              <q-icon name="event" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-model="showLimit"
            :options="['Sim', 'Não']"
            label="Limite de utilização"
            outlined
            dense
            options-dense
            bg-color="white"
            label-color="black"
            :readonly="loadingCoupon || loadingResource || loadingSubscription"
          >
            <template v-slot:prepend>
              <q-icon name="donut_large" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataCoupon.limit"
            bg-color="white"
            label-color="black"
            outlined
            label="Limite"
            dense
            input-class="text-black"
            mask="#########"
            :readonly="loadingCoupon || loadingResource || loadingSubscription"
            :disable="showLimit == 'Não'"
          >
            <template v-slot:prepend>
              <q-icon name="pin" color="black" size="20px" />
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
            :loading="loadingCoupon || loadingResource || loadingSubscription"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingCoupon || loadingResource || loadingSubscription"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
