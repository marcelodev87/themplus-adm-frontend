<script lang="ts" setup>
import { computed, reactive, watch } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import { useSettingStore } from 'src/stores/setting-store';
import { storeToRefs } from 'pinia';
import { Notify } from 'quasar';

const { getSetting, updateSettings } = useSettingStore();
const { loadingSetting, listSetting } = storeToRefs(useSettingStore());

defineOptions({
  name: 'FormSetting',
});

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  'update:open': [void];
}>();

const dataSettings = reactive({
  allowAutomaticSaveFeedbackValue: 0 as number,
});

const update = async () => {
  const response = await updateSettings({
    allow_feedback_saved: String(dataSettings.allowAutomaticSaveFeedbackValue),
  });

  if (response?.status === 200) {
    emit('update:open');
  } else {
    Notify.create({
      message: 'Erro ao atualizar configuração(ões)',
      type: 'negative',
    });
  }
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const mountSettings = () => {
  Object.assign(dataSettings, {
    allowAutomaticSaveFeedbackValue: Number(
      listSetting.value.find((item) => item.key === 'allow_feedback_saved')?.value,
    ),
  });
};

watch(open, async () => {
  if (open.value) {
    await getSetting();
    mountSettings();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card>
      <q-card-section class="q-pa-none">
        <TitlePage class="bg-grey-3" title="Configurações de feedbacks" />
      </q-card-section>
      <q-card-section>
        <q-toggle
          v-model="dataSettings.allowAutomaticSaveFeedbackValue"
          :true-value="1"
          :false-value="0"
        >
          <span>
            Permitir salvar feedbacks
            <span class="text-bold">automaticamente</span>
          </span>
        </q-toggle>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          @click="update"
          :loading="loadingSetting"
          color="primary"
          label="Salvar"
          size="md"
          unelevated
          no-caps
        />
        <q-btn color="red" label="Fechar" size="md" @click="open = false" unelevated no-caps flat />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
