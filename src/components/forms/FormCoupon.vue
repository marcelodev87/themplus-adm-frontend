<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { useCouponStore } from 'src/stores/coupon-store';
import { storeToRefs } from 'pinia';
import type { CouponData } from 'src/ts/interfaces/models/subscriptions';
import { checkDataCoupon } from 'src/helpers/checkData';

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

const showExpired = ref<boolean>(false);
const showDiscount = ref<boolean>(false);
const dataCoupon = reactive({
  name: '' as string,
  movements: 30 as number,
  allowFinancial: 0 as number,
  allowMembers: 0 as number,
  allowAssistantWhatsapp: 0 as number,
  discount: '' as string,
  dateExpires: '' as string,
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const clear = (): void => {
  Object.assign(dataCoupon, {
    name: '',
    movements: 30,
    allowFinancial: 0,
    allowMembers: 0,
    allowAssistantWhatsapp: 0,
    newDiscount: '',
    dateExpires: '',
  });
  showExpired.value = false;
  showDiscount.value = false;
};
const save = async () => {
  const check = checkDataCoupon(
    dataCoupon, 
    showDiscount.value, 
    dataCoupon.dateExpires.trim() !== ''
  );
  if (check.status) {
    const response = await useCouponStore().createCoupon(
      dataCoupon.name,
      dataCoupon.movements,
      dataCoupon.allowFinancial,
      dataCoupon.allowMembers,
      dataCoupon.allowAssistantWhatsapp,
      dataCoupon.discount.trim() !== '' ? Number(dataCoupon.discount) : null,
      dataCoupon.dateExpires.trim() !== '' ? dataCoupon.dateExpires : null,
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
  const check = checkDataCoupon(
    dataCoupon, 
    showDiscount.value,
    dataCoupon.dateExpires.trim() !== ''
  );
  if (check.status) {
    const response = await useCouponStore().updateCoupon(
      props.dataId ?? '',
      dataCoupon.name,
      dataCoupon.movements,
      dataCoupon.allowFinancial,
      dataCoupon.allowMembers,
      dataCoupon.allowAssistantWhatsapp,
      dataCoupon.discount.trim() !== '' ? Number(dataCoupon.discount) : null,
      dataCoupon.dateExpires.trim() !== '' ? dataCoupon.dateExpires : null,
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
    movements: coupon.movements,
    allowFinancial: coupon.allow_financial,
    allowMembers: coupon.allow_members,
    allowAssistantWhatsapp: coupon.allow_assistant_whatsapp,
    newPrice: coupon.new_price ?? '',
    dateExpires: coupon.date_expires ?? '',
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

watch(
  () => dataCoupon.discount,
  (discount) => {
    dataCoupon.discount = discount.replace(/^0+/, '');
  },
);
watch(showExpired, () => {
  dataCoupon.dateExpires = '';
});
watch(showDiscount, () => {
  dataCoupon.discount = '';
});
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
            filled
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
          <q-input
            v-model="dataCoupon.movements"
            bg-color="white"
            label-color="black"
            filled
            label="Quantidade de movimentações"
            dense
            input-class="text-black"
            mask="####"
            :readonly="loadingCoupon"
          >
            <template v-slot:prepend>
              <q-icon name="pin" color="black" size="20px" />
            </template>
          </q-input>
          <q-toggle
            v-model="dataCoupon.allowFinancial"
            :readonly="loadingCoupon"
            :true-value="1"
            :false-value="0"
          >
            <span>
              Permitir organização
              <span class="text-bold">acessar contabilidade</span>
            </span>
          </q-toggle>
          <q-toggle
            v-model="dataCoupon.allowMembers"
            :readonly="loadingCoupon"
            :true-value="1"
            :false-value="0"
          >
            <span>
              Permitir organização
              <span class="text-bold">acessar gerencimanto de membros</span>
            </span>
          </q-toggle>
          <q-toggle
            v-model="dataCoupon.allowAssistantWhatsapp"
            :readonly="loadingCoupon"
            :true-value="1"
            :false-value="0"
          >
            <span>
              Permitir organização
              <span class="text-bold">ter acesso ao assistente de whatsapp</span>
            </span>
          </q-toggle>
          <q-toggle v-model="showExpired" :readonly="loadingCoupon">
            <span>
              O cupom
              <span class="text-bold">tem data de expiração</span>
            </span>
          </q-toggle>
          <q-input
            v-show="showExpired"
            v-model="dataCoupon.dateExpires"
            bg-color="white"
            label-color="black"
            filled
            label="Data de expiração"
            dense
            input-class="text-black"
            mask="##/##/####"
            :readonly="loadingCoupon"
          >
            <template v-slot:prepend>
              <q-icon name="event" color="black" size="20px" />
            </template>
          </q-input>
          <q-toggle v-model="showDiscount" :readonly="loadingCoupon">
            <span>
              O cupom
              <span class="text-bold">gera desconto na assinatura</span>
            </span>
          </q-toggle>
          <q-input
            v-show="showDiscount"
            v-model="dataCoupon.discount"
            bg-color="white"
            label-color="black"
            filled
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
