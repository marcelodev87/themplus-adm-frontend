<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import type { QuasarTable } from 'src/ts/interfaces/quasar/quasar';
import { useUsersMembersStore } from 'src/stores/users-store';
import { storeToRefs } from 'pinia';
import FormUser from 'src/components/forms/FormUser.vue';
import type { UserADM } from 'src/ts/interfaces/models/user';
import { useAuthStore } from 'src/stores/auth-store';
import { useFeedbackStore } from 'src/stores/feedback-store';
import Paginate from 'src/components/general/Paginate.vue';

defineOptions({
  name: 'User',
});

const { listUserMember, loadingUsersMembers } = storeToRefs(useUsersMembersStore());
const { user } = storeToRefs(useAuthStore());

const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(11);
const dataEdit = ref<UserADM | null>(null);
const showFormUser = ref<boolean>(false);
const filterUser = ref<string>('');
const userSortPagination = ref<{
  sortBy: string | null;
  descending: boolean;
  page: number;
  rowsPerPage: number;
}>({ sortBy: null, descending: false, page: 1, rowsPerPage: 0 });
const columnsUser = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
    sortable: true,
    sort: (a, b) =>
      String(a ?? '').localeCompare(String(b ?? ''), 'pt-BR', { sensitivity: 'base' }),
  },
  {
    name: 'email',
    label: 'E-mail',
    field: 'email',
    align: 'left',
    sortable: true,
    sort: (a, b) =>
      String(a ?? '').localeCompare(String(b ?? ''), 'pt-BR', { sensitivity: 'base' }),
  },
  {
    name: 'position',
    label: 'Cargo',
    field: 'position',
    align: 'left',
    sortable: true,
    sort: (a, b) =>
      String(a ?? '').localeCompare(String(b ?? ''), 'pt-BR', { sensitivity: 'base' }),
  },
  {
    name: 'department',
    label: 'Departamento',
    field: 'department.name',
    align: 'left',
    sortable: true,
    sort: (_a, _b, rowA, rowB) =>
      String(rowA?.department?.name ?? '').localeCompare(
        String(rowB?.department?.name ?? ''),
        'pt-BR',
        { sensitivity: 'base' },
      ),
  },
  {
    name: 'active',
    label: 'Ativo',
    field: 'active',
    align: 'left',
    sortable: true,
    sort: (a, b) => Number(b ?? 0) - Number(a ?? 0),
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
  dataEdit.value = null;
};
const resetPage = (): void => {
  currentPage.value = 1;
};
const openFormUser = (): void => {
  showFormUser.value = true;
};
const closeFormUser = (): void => {
  showFormUser.value = false;
  clear();
};
const fetchUsers = async () => {
  await useUsersMembersStore().getUsersMembers();
};
const setActive = async (active: number, userId: string) => {
  await useUsersMembersStore().updateActiveUser(active, userId);
};
const exclude = async (id: string): Promise<void> => {
  await useUsersMembersStore().deleteUserMember(id);
};
const handleEdit = (data: UserADM) => {
  dataEdit.value = data;
  openFormUser();
};
const filteredMembersEnterprise = computed(() => {
  const normalize = (text: string): string => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };
  resetPage();
  const searchTerm = normalize(filterUser.value);
  return listUserMember.value.filter((item) => {
    const positionText = item.position === 'admin' ? 'Administrador' : 'Usuário comum';
    const departmentText = item.department_id ? (item.department?.name ?? '') : 'Não definido';
    return (
      normalize(item.name ?? '').includes(searchTerm) ||
      normalize(item.email ?? '').includes(searchTerm) ||
      normalize(positionText).includes(searchTerm) ||
      normalize(departmentText).includes(searchTerm) ||
      normalize(item.active ? 'ativo' : 'inativo').includes(searchTerm)
    );
  });
});

const sortedUsers = computed(() => {
  const { sortBy, descending } = userSortPagination.value;
  if (!sortBy) return filteredMembersEnterprise.value;
  const col = columnsUser.find((c) => c.name === sortBy);
  if (!col) return filteredMembersEnterprise.value;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getVal = (row: any) =>
    typeof col.field === 'function'
      ? col.field(row)
      : col.field
        ? String(col.field)
            .split('.')
            .reduce((o: any, k: string) => o?.[k], row)
        : '';
  return [...filteredMembersEnterprise.value].sort((a, b) => {
    const res = col.sort
      ? col.sort(getVal(a), getVal(b), a, b)
      : String(getVal(a) ?? '').localeCompare(String(getVal(b) ?? ''), 'pt-BR', {
          sensitivity: 'base',
        });
    return descending ? -res : res;
  });
});
const listUserMemberCurrent = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return sortedUsers.value.slice(start, end);
});
const maxPages = computed(() => {
  return Math.ceil(filteredMembersEnterprise.value.length / rowsPerPage.value);
});

onMounted(async () => {
  clear();
  await fetchUsers();
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
        <TitlePage title="Gerenciamento de usuários" />
      </div>
      <div v-if="!$q.screen.lt.sm" class="col-6 row items-center justify-end q-gutter-x-sm">
        <q-btn
          @click="openFormUser"
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
          :rows="listUserMemberCurrent"
          :columns="columnsUser"
          :loading="loadingUsersMembers"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhum usuário para mostrar"
          virtual-scroll
          :rows-per-page-options="[rowsPerPage]"
          v-model:pagination="userSortPagination"
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
                  @click="setActive(props.row.active === 1 ? 0 : 1, props.row.id)"
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
                <q-btn
                  @click="handleEdit(props.row)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
                <q-btn
                  v-show="user && user.id !== props.row.id && props.row.created_by !== null"
                  @click="exclude(props.row.id)"
                  size="sm"
                  flat
                  round
                  color="red"
                  icon="delete"
                />
              </q-td>
            </q-tr>
          </template>
          <template v-slot:bottom>
            <Paginate
              v-model="currentPage"
              :max="maxPages"
              :length="filteredMembersEnterprise.length"
            />
          </template>
        </q-table>
      </main>
    </q-scroll-area>
    <FormUser :open="showFormUser" :data-edit="dataEdit" @update:open="closeFormUser" />
  </section>
</template>
