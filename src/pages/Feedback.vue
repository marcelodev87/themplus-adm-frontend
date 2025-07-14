<script setup lang="ts">
import { storeToRefs } from 'pinia';
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';
import FeedbackView from 'src/components/details/FeedbackView.vue';
import FormSetting from 'src/components/forms/FormSetting.vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { useFeedbackStore } from 'src/stores/feedback-store';
import type { Feedback } from 'src/ts/interfaces/models/feedback';
import type { QuasarTable } from 'src/ts/interfaces/quasar/quasar';
import { onMounted, reactive, ref, watch } from 'vue';

defineOptions({
  name: 'Feedback',
});

const { getFeedbacks, getFeedbacksSaved, saveFeedback, exclude, deleteSaved } = useFeedbackStore();
const { listFeedbacks, loadingFeedback } = storeToRefs(useFeedbackStore());

const tab = ref<'received' | 'saved'>('received');
const showFeedBackDetails = ref<boolean>(false);
const selectedData = ref<Feedback | null>(null);
const selectedId = ref<string | null>(null);
const showConfirmAction = ref<boolean>(false);
const dataSaved = ref<boolean>(false);
const showSettingsFeedback = ref<boolean>(false);
const columnsFeedback = reactive<QuasarTable[]>([
  {
    name: 'user_name',
    label: 'Usuário',
    field: 'user_name',
    align: 'left',
  },
  {
    name: 'organization_name',
    label: 'Organização',
    field: 'organization_name',
    align: 'left',
  },

  {
    name: 'created',
    label: 'Data de criação',
    field: 'created',
    align: 'left',
  },
  {
    name: 'message',
    label: 'Mensagem',
    field: 'message',
    align: 'left',
    style: 'max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
  },
  {
    name: 'action',
    label: 'Ações',
    field: 'action',
    align: 'right',
  },
]);

const clear = () => {
  selectedData.value = null;
  dataSaved.value = false;
  selectedId.value = null;
};
const openFeedbackSetting = () => {
  showSettingsFeedback.value = true;
};
const closeFeedbackSetting = () => {
  showSettingsFeedback.value = false;
};
const openFeedbackDetails = () => {
  showFeedBackDetails.value = true;
};
const handleFeedbackData = (data: Feedback | null) => {
  selectedData.value = data;
  openFeedbackDetails();
};
const closeFeedBackDetails = (): void => {
  showFeedBackDetails.value = false;
  clear();
};
const openConfirmAction = (id: string, saved: boolean) => {
  selectedId.value = id;
  showConfirmAction.value = true;
  dataSaved.value = saved;
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  if (dataSaved.value) {
    await deleteSaved(selectedId.value ?? '');
  } else {
    await exclude(selectedId.value ?? '');
  }
  clear();
};
const handleSaveFeedback = async (id: string) => {
  await saveFeedback(id);
};

watch(tab, async () => {
  if (tab.value === 'received') {
    await getFeedbacks();
    await useFeedbackStore().getcountFeedbacks();
  }

  if (tab.value === 'saved') {
    await getFeedbacksSaved();
    await useFeedbackStore().getcountFeedbacks();
  }
});

onMounted(async () => {
  await getFeedbacks();
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
        <TitlePage title="Gerenciamento de feedbacks" class="bg-grey-1" />
      </div>
      <div
        class="col-7 row items-center justify-end q-gutter-x-sm"
        :class="!$q.screen.lt.sm ? '' : 'q-mb-sm'"
      >
        <q-btn
          @click="openFeedbackSetting"
          icon-right="settings"
          label="Configurações"
          unelevated
          no-caps
          flat
          class="q-mr-sm bg-contabilidade"
        />
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm q-mb-md" :style="!$q.screen.lt.sm ? '' : 'width: 98vw'">
        <q-tabs v-model="tab" inline-label>
          <q-tab name="received" label="Recebidos" no-caps>
            <q-icon name="local_post_office" color="black" size="20px" class="q-ml-sm" />
          </q-tab>
          <q-tab name="saved" label="Salvos" no-caps>
            <q-icon name="download" color="black" size="20px" class="q-ml-sm" />
          </q-tab>
        </q-tabs>

        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="received">
            <q-table
              :rows="listFeedbacks"
              :columns="columnsFeedback"
              :loading="loadingFeedback"
              flat
              bordered
              dense
              row-key="index"
              no-data-label="Nenhuma organização para mostrar"
              virtual-scroll
              :rows-per-page-options="[20]"
            >
              <template v-slot:body="props">
                <q-tr :props="props" style="height: 28px">
                  <q-td key="user_name" :props="props" class="text-left">
                    {{ props.row.user_name }}
                  </q-td>
                  <q-td key="organization_name" :props="props" class="text-left">
                    {{ props.row.organization_name }}
                  </q-td>
                  <q-td key="created" :props="props" class="text-left">
                    {{ props.row.created.replace(/[-/]/g, '/') }}
                  </q-td>
                  <q-td key="message" :props="props" class="text-left">
                    {{ props.row.message }}
                  </q-td>
                  <q-td key="action" class="text-right">
                    <q-btn
                      @click="handleFeedbackData(props.row)"
                      :disable="loadingFeedback"
                      size="sm"
                      flat
                      round
                      icon="visibility"
                    />
                    <q-btn
                      @click="handleSaveFeedback(props.row.id)"
                      :disable="loadingFeedback"
                      size="sm"
                      flat
                      round
                      icon="vertical_align_bottom"
                    />
                    <q-btn
                      @click="openConfirmAction(props.row.id, false)"
                      :disable="loadingFeedback"
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
          </q-tab-panel>

          <q-tab-panel name="saved">
            <q-table
              :rows="listFeedbacks"
              :columns="columnsFeedback"
              :loading="loadingFeedback"
              flat
              bordered
              dense
              row-key="index"
              no-data-label="Nenhuma organização para mostrar"
              virtual-scroll
              :rows-per-page-options="[20]"
            >
              <template v-slot:body="props">
                <q-tr :props="props" style="height: 28px">
                  <q-td key="user_name" :props="props" class="text-left">
                    {{ props.row.user_name }}
                  </q-td>
                  <q-td key="organization_name" :props="props" class="text-left">
                    {{ props.row.organization_name }}
                  </q-td>
                  <q-td key="created" :props="props" class="text-left">
                    {{ props.row.created }}
                  </q-td>
                  <q-td key="message" :props="props" class="text-left">
                    {{ props.row.message }}
                  </q-td>
                  <q-td key="action" class="text-right">
                    <q-btn
                      @click="handleFeedbackData(props.row)"
                      :disable="loadingFeedback"
                      size="sm"
                      flat
                      round
                      icon="visibility"
                    />
                    <q-btn
                      @click="openConfirmAction(props.row.id, true)"
                      :disable="loadingFeedback"
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
          </q-tab-panel>
        </q-tab-panels>
      </main>
    </q-scroll-area>
  </section>
  <FeedbackView
    :open="showFeedBackDetails"
    :feedbackData="selectedData"
    @update:open="closeFeedBackDetails"
  />
  <FormSetting :open="showSettingsFeedback" @update:open="closeFeedbackSetting" />
  <ConfirmAction
    :open="showConfirmAction"
    label-action="Continuar"
    title="Confirmação de exclusão"
    message="Excluindo o feedback, o mesmo será perdido para sempre."
    @update:open="closeConfirmAction"
    @update:ok="closeConfirmActionOk"
  />
</template>
