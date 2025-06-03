<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from './shared/TitlePage.vue';
import type { QuasarTable } from 'src/ts/interfaces/quasar/quasar';
import { storeToRefs } from 'pinia';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import type { User } from 'src/ts/interfaces/models/user';
import FormManageMember from './forms/FormManageMembers.vue';
import { useUsersMembersStore } from 'src/stores/users-store';

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

const showFormManageMember = ref<boolean>(false);
const dataMemberSelected = ref<User | null>(null);
const filterMembers = ref<string>('');
const columnsMembers = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'email',
    label: 'E-mail',
    field: 'email',
    align: 'left',
  },
  {
    name: 'position',
    label: 'Cargo',
    field: 'position',
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
    align: 'right',
  },
]);

const handleEditMember = (dataMember: User | null) => {
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
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
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
        <TitlePage :title="'Gerenciar Membros'" />
      </q-card-section>
      <q-card-section>
        <q-table
          :rows="listEnterpriseMembers"
          :columns="columnsMembers"
          :filter="filterMembers"
          :loading="loadingEnterprise"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhum membro da organização para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
        >
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="name" :props="props" class="text-left">
                {{ props.row.name }}
              </q-td>
              <q-td key="email" :props="props" class="text-left">
                {{ props.row.email }}
              </q-td>
              <q-td key="position" :props="props" class="text-left">
                {{ props.row.position }}
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
                  @click="exclude(props.row.id)"
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
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn @click="open = false" color="red" label="Fechar" size="md" unelevated no-caps />
        </div>
      </q-card-actions>
    </q-card>
    <FormManageMember
      :open="showFormManageMember"
      :user="dataMemberSelected"
      @update:open="closeFormManageMembers"
    />
  </q-dialog>
</template>
