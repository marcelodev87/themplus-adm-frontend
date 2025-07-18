<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import { useDepartmentStore } from 'src/stores/department-store';
import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';
import type { Department } from 'src/ts/interfaces/models/department';
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';
import FormDepartment from 'src/components/forms/FormDepartment.vue';
import { useFeedbackStore } from 'src/stores/feedback-store';

defineOptions({
  name: 'Department',
});

const $q = useQuasar();

const { loadingDepartment, treeDepartment } = storeToRefs(useDepartmentStore());
const { deleteDepartment } = useDepartmentStore();
const { user } = storeToRefs(useAuthStore());

const showFormDepartment = ref<boolean>(false);
const selectedObject = ref<string>('');
const clickRootCreate = ref<string | null>(null);
const departmentEdit = ref<Department | null>(null);
const showConfirmAction = ref<boolean>(false);
const dataExcludeId = ref<string | null>(null);
const filterDepartment = ref<string>('');

const clear = () => {
  clickRootCreate.value = '';
  selectedObject.value = '';
  departmentEdit.value = null;
  dataExcludeId.value = null;
  filterDepartment.value = '';
};
const openFormDepartment = (key = null): void => {
  if (key) {
    clickRootCreate.value = key;
  }
  showFormDepartment.value = true;
};
const closeFormDepartment = (): void => {
  showFormDepartment.value = false;
  clear();
};
const handleEdit = (department: Department) => {
  if (user.value?.view_enterprise_id === null) {
    departmentEdit.value = department;
    openFormDepartment();
  }
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await deleteDepartment(dataExcludeId.value ?? '');
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: string): void => {
  dataExcludeId.value = id;
  showConfirmAction.value = true;
};

onMounted(async () => {
  clear();
  await useFeedbackStore().getcountFeedbacks();
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
        <TitlePage title="Gerenciamento de departamentos" />
      </div>
      <div
        class="col-7 row items-center justify-end q-gutter-x-sm"
        :class="!$q.screen.lt.sm ? '' : 'q-mb-sm'"
      >
        <q-btn
          @click="openFormDepartment()"
          icon-right="add"
          label="Departamento"
          unelevated
          no-caps
          class="q-mr-sm bg-contabilidade"
        />
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm q-mb-md">
        <div class="row q-col-gutter-sm">
          <q-tree
            v-show="treeDepartment.length > 0"
            v-model:selected="selectedObject"
            :nodes="treeDepartment"
            :filter="filterDepartment"
            node-key="id"
            class="full-width text-subtitle1"
          >
            <template v-slot:default-header="prop">
              <div class="row full-width wrap justify-between content-start">
                <div class="row items-center justify-center">
                  <q-icon name="groups" color="black" size="22px" class="q-mr-sm" />
                  <q-btn
                    size="sm"
                    flat
                    rounded
                    color="black"
                    :disable="loadingDepartment"
                    @click="handleEdit(prop.node)"
                  >
                    {{ prop.node.label }}
                  </q-btn>
                </div>
                <q-separator />
                <div class="row items-center justify-center">
                  <q-btn
                    :label="!$q.screen.lt.sm ? 'Adicionar um sub-departamento' : ''"
                    @click="openFormDepartment(prop.key)"
                    :disable="false"
                    size="sm"
                    rounded
                    flat
                    icon="add"
                    unelevated
                  />
                  <q-btn
                    @click="openConfirmAction(prop.node.id)"
                    :disable="loadingDepartment"
                    size="sm"
                    flat
                    rounded
                    color="negative"
                    icon="delete"
                  />
                </div>
              </div>
            </template>
          </q-tree>
          <div v-show="treeDepartment.length == 0 && !loadingDepartment" class="q-pa-md full-width">
            <q-banner dense inline-actions class="text-white bg-red" rounded>
              Não há departamentos registrados. Por favor, adicione um novo departamento.
            </q-banner>
          </div>
          <q-inner-loading
            :showing="false"
            label="Aguarde..."
            label-class="text-black"
            label-style="font-size: 1.1em"
            color="primary"
            size="50px"
          />
        </div>
      </main>
    </q-scroll-area>
    <FormDepartment
      :open="showFormDepartment"
      :key-root="clickRootCreate"
      :department-edit="departmentEdit"
      @update:open="closeFormDepartment"
    />
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão de departamento"
      message="Caso haja subdepartamentos vinculados, eles também serão excluídos. Caso tenha certeza de que deseja excluir o departamento, clique em 'Continuar'."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>

<style>
.teste {
  border: 1px solid black;
}
</style>
