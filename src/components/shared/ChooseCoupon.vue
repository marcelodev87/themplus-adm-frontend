<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import type { QuasarSelect } from 'src/ts/interfaces/quasar/quasar';
import { useCouponStore } from 'src/stores/coupon-store';
import { useEnterpriseStore } from 'src/stores/enterprise-store';

defineOptions({
  name: 'ChooseCoupon',
});

const props = defineProps<{
  open: boolean;
  enterprise: {id: string, couponId: string | null} | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { getCoupons } = useCouponStore();
const { loadingCoupon, listCoupon } = storeToRefs(useCouponStore());
const { setCoupon } = useEnterpriseStore();
const { loadingEnterprise } = storeToRefs(useEnterpriseStore());

const selectedCoupon = ref<QuasarSelect<string | null>>({
    label: 'Nenhum selecionado',
    value: null
});

const clear = (): void => {
  selectedCoupon.value = {
    label: 'Nenhum selecionado',
    value: null
  }
};
const save = async () => {
    const response = await setCoupon (props.enterprise?.id ?? '', selectedCoupon.value.value)
    if(response?.status === 200) {
        emit('update:open')
    }
}

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const optionsCoupons = computed(() => {
    const list = listCoupon.value.map((item) => {
        return {
            label: item.name,
            value: item.id
        }
    })
    return [...list,{
        label: 'Nenhum selecionado',
        value: null
    }]
})

watch(open, async () => {
  if (open.value) {
    clear();
    await getCoupons();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Defina um cupom" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
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
            color="primary"
            label="Salvar"
            size="md"
            :loading="loadingCoupon || loadingEnterprise"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
