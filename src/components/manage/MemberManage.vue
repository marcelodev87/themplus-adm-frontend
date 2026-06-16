<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import type { QuasarTable } from 'src/ts/interfaces/quasar/quasar';
import { storeToRefs } from 'pinia';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import type { User } from 'src/ts/interfaces/models/user';
import FormManageMembers from '../forms/FormManageMembers.vue';
import { useUsersMembersStore } from 'src/stores/users-store';
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';
import Paginate from '../general/Paginate.vue';

defineOptions({
  name: 'ManageMember',
});

const props = defineProps<{
  open: boolean;
  enterpriseId: string | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { listEnterpriseMembers, loadingEnterprise } = storeToRefs(useEnterpriseStore());
const { getMembersByEnterprise, clearListMembers } = useEnterpriseStore();
const { deleteExternalUserMember } = useUsersMembersStore();

const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(10);
const showConfirmAction = ref<boolean>(false);
const showFormManageMember = ref<boolean>(false);
const dataMemberSelected = ref<User | null>(null);
const dataMemberSelectedExclude = ref<string | null>(null);
const filterMembers = ref<string>('');
const membersSortPagination = ref<{
  sortBy: string | null;
  descending: boolean;
  page: number;
  rowsPerPage: number;
}>({ sortBy: null, descending: false, page: 1, rowsPerPage: 0 });
const columnsMembers = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
    sortable: true,
    sort: (a, b) => String(a ?? '').localeCompare(String(b ?? ''), 'pt-BR', { sensitivity: 'base' }),
  },
  {
    name: 'email',
    label: 'E-mail',
    field: 'email',
    align: 'left',
    sortable: true,
    sort: (a, b) => String(a ?? '').localeCompare(String(b ?? ''), 'pt-BR', { sensitivity: 'base' }),
  },
  {
    name: 'position',
    label: 'Cargo',
    field: 'position',
    align: 'left',
    sortable: true,
    sort: (a, b) => String(a ?? '').localeCompare(String(b ?? ''), 'pt-BR', { sensitivity: 'base' }),
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
    align: 'right',
  },
]);

const clear = (): void => {
  dataMemberSelected.value = null;
  dataMemberSelectedExclude.value = null;
};
const resetPage = (): void => {
  currentPage.value = 1;
};
const handleEditMember = (dataMember: User) => {
  dataMemberSelected.value = dataMember;
  openFormManageMembers();
};
const exclude = async (id: string) => {
  await deleteExternalUserMember(id);
};
const openFormManageMembers = () => {
  showFormManageMember.value = true;
};
const closeFormManageMembers = () => {
  showFormManageMember.value = false;
  clear();
};
const openConfirmAction = (id: string): void => {
  dataMemberSelectedExclude.value = id;
  showConfirmAction.value = true;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await exclude(dataMemberSelectedExclude.value ?? '');
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const filteredMembersEnterprise = computed(() => {
  const normalize = (text: string): string => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };
  const searchTerm = normalize(filterMembers.value);
  resetPage();
  return listEnterpriseMembers.value.filter((item) => {
    const positionText = item.position === 'admin' ? 'Administrador' : 'Usuário comum';
    return (
      normalize(item.name ?? '').includes(searchTerm) ||
      normalize(item.email ?? '').includes(searchTerm) ||
      normalize(positionText).includes(searchTerm) ||
      normalize(item.active ? 'ativo' : 'inativo').includes(searchTerm)
    );
  });
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const sortedMembers = computed(() => {
  const { sortBy, descending } = membersSortPagination.value;
  if (!sortBy) return filteredMembersEnterprise.value;
  const col = columnsMembers.find((c) => c.name === sortBy);
  if (!col) return filteredMembersEnterprise.value;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getVal = (row: any) => (typeof col.field === 'function' ? col.field(row) : col.field ? String(col.field).split('.').reduce((o: any, k: string) => o?.[k], row) : '');
  return [...filteredMembersEnterprise.value].sort((a, b) => {
    const res = col.sort ? col.sort(getVal(a), getVal(b), a, b) : String(getVal(a) ?? '').localeCompare(String(getVal(b) ?? ''), 'pt-BR', { sensitivity: 'base' });
    return descending ? -res : res;
  });
});
const listEnterpriseMembersCurrent = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return sortedMembers.value.slice(start, end);
});
const maxPages = computed(() => {
  return Math.ceil(filteredMembersEnterprise.value.length / rowsPerPage.value);
});

watch(open, async () => {
  if (open.value) {
    clearListMembers();
    await getMembersByEnterprise(props.enterpriseId!);
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card style="min-width: 98vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Gerenciar Membros" />
      </q-card-section>
      <q-card-section>
        <q-table
          :rows="listEnterpriseMembersCurrent"
          :columns="columnsMembers"
          :loading="loadingEnterprise"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhum membro da organização para mostrar"
          virtual-scroll
          :rows-per-page-options="[rowsPerPage]"
          v-model:pagination="membersSortPagination"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de membros</span>
            <q-space />
            <q-input filled v-model="filterMembers" dense label="Pesquisar">
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
              <q-td key="active" :props="props" class="text-left">
                <q-icon
                  :name="props.row.active ? 'person_check' : 'person_cancel'"
                  :color="props.row.active ? 'green' : 'red'"
                />
              </q-td>
              <q-td key="action" :props="props" class="text-left">
                <q-btn
                  @click="handleEditMember(props.row)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                  :disable="loadingEnterprise"
                >
                  <q-tooltip> Atualizar </q-tooltip>
                </q-btn>
                <q-btn
                  v-show="props.row.created_by"
                  @click="openConfirmAction(props.row.id)"
                  :disable="loadingEnterprise"
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
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn @click="open = false" color="red" label="Fechar" size="md" unelevated no-caps />
        </div>
      </q-card-actions>
    </q-card>
    <FormManageMembers
      :open="showFormManageMember"
      :user="dataMemberSelected"
      @update:open="closeFormManageMembers"
    />
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão"
      message="Excluindo o membro, será apagado tudo que esteja vinculado ao mesmo. Caso tenha certeza de que deseja excluir este membro, clique em 'Continuar'."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </q-dialog>
</template>
