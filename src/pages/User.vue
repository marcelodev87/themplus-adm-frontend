<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import type { QuasarTable } from 'src/ts/interfaces/quasar/quasar';

defineOptions({
  name: 'User',
});

const filterUser = ref<string>('');
const columnsUser = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    label: 'E-mail',
    field: 'email',
    align: 'left',
    sortable: true,
  },
  {
    name: 'phone',
    label: 'Telefone',
    field: 'phone',
    align: 'left',
  },
  {
    name: 'position',
    label: 'Cargo',
    field: 'position',
    align: 'left',
  },
  {
    name: 'department',
    label: 'Departamento',
    field: 'departments.name',
    align: 'left',
  },
  {
    name: 'active',
    label: 'Ativo',
    field: 'active',
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
  filterUser.value = '';
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
        <TitlePage title="Gerenciamento de usuários" />
      </div>
      <div v-if="!$q.screen.lt.sm" class="col-6 row items-center justify-end q-gutter-x-sm">
        <q-btn
          icon-right="add"
          label="Usuário"
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
          :columns="columnsUser"
          :filter="filterUser"
          :loading="false"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhum usuário para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de usuários</span>
            <q-space />
            <q-input filled v-model="filterUser" dense label="Pesquisar">
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
              <q-td key="email" :props="props" class="text-left">
                {{ props.row.email }}
              </q-td>
              <q-td key="phone" :props="props" class="text-left">
                {{ props.row.phone ?? 'Não definido' }}
              </q-td>
              <q-td key="position" :props="props" class="text-left">
                {{ props.row.position === 'admin' ? 'Administrador' : 'Usuário comum' }}
              </q-td>
              <q-td key="department" :props="props" class="text-left">
                {{ props.row.department_id ? props.row.department.name : `Não definido` }}
              </q-td>
              <q-td key="active" :props="props" class="text-left">
                <q-icon
                  :name="props.row.active ? 'person_check' : 'person_cancel'"
                  :color="props.row.active ? 'green' : 'red'"
                />
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  size="sm"
                  flat
                  round
                  :color="props.row.active ? 'red' : 'green'"
                  :icon="props.row.active ? 'block' : 'check'"
                >
                  <q-tooltip>
                    {{ props.row.active ? 'Inativar' : 'Ativar' }}
                  </q-tooltip>
                </q-btn>
                <q-btn size="sm" flat round color="black" icon="edit" />
                <q-btn size="sm" flat round color="red" icon="delete" />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </main>
    </q-scroll-area>
  </section>
</template>
