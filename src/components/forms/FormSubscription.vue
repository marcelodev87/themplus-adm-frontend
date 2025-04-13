<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import { useSubscriptionStore } from 'src/stores/subscription-store';
import { checkDataSubscription } from 'src/helpers/checkData';

defineOptions({
  name: 'FormSubscription',
});

const props = defineProps<{
  open: boolean;
  data: { id: string; name: string; price: string } | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingSubscription } = storeToRefs(useSubscriptionStore());

const dataSubscription = reactive({
  name: '' as string,
  price: '' as string,
});

const clear = (): void => {
  Object.assign(dataSubscription, {
    name: '' as string,
    price: '' as string,
  });
};
const update = async () => {
  const check = checkDataSubscription(dataSubscription);
  if (check.status) {
    const response = await useSubscriptionStore().updateSubscription(
      props.data?.id ?? '',
      Number(dataSubscription.price),
    );
    if (response?.status === 200) {
      clear();
      emit('update:open');
    }
  } else {
    Notify.create({
      message: check.message || 'Erro ao atualizar assinatura',
      type: 'negative',
    });
  }
};
const checkDataEdit = () => {
  if (props.data) {
    Object.assign(dataSubscription, {
      name: props.data.name,
      price: props.data.price,
    });
  }
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    clear();
    checkDataEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Atualizar a assinatura" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataSubscription.name"
            bg-color="white"
            label-color="black"
            outlined
            label="Nome da assinatura"
            dense
            input-class="text-black text-capitalize"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="sell" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataSubscription.price"
            bg-color="white"
            label-color="black"
            outlined
            label="Preço da assinatura"
            dense
            input-class="text-black"
            mask="#.##"
            fill-mask="0"
            reverse-fill-mask
            :readonly="loadingSubscription"
          >
            <template v-slot:prepend>
              <q-icon name="paid" color="black" size="20px" />
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
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingSubscription"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
