<script lang="ts" setup>
import { computed, reactive, watch } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import type { User } from 'src/ts/interfaces/models/user';
import { storeToRefs } from 'pinia';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import { Notify } from 'quasar';

defineOptions({
  name: 'FormManageMembers',
});

const props = defineProps<{
  open: boolean;
  user: User | null;
}>();

const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingEnterprise } = storeToRefs(useEnterpriseStore());
const { updateEnterpriseMember } = useEnterpriseStore();

const userData = reactive({
  name: '' as string,
  email: '' as string,
  phone: '' as string,
  active: '' as string,
  position: '' as string,
});

const checkData = (): { status: boolean; message?: string } => {
  if (userData.name.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o nome da organização',
    };
  }
  if (userData.name.trim().length < 2) {
    return {
      status: false,
      message: 'Nome da organização deve ter mais de 2 caracteres',
    };
  }
  if (
    userData.email.trim() === '' ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userData.email.trim())
  ) {
    return { status: false, message: 'Informe um e-mail válido para sua organização' };
  }

  return { status: true };
};

const clear = (): void => {
  Object.assign(userData, {
    name: '',
    email: '',
    phone: '',
    active: '',
    position: '',
  });
};

const mountUserEdit = () => {
  Object.assign(userData, {
    name: props.user?.name,
    email: props.user?.email,
    phone: props.user?.phone ?? '',
    active: props.user?.active === 1 ? 'Ativo' : 'Inativo',
    position: props.user?.position === 'admin' ? 'Administrador' : 'Usuário comum',
  });
};

const updateMember = async () => {
  const check = checkData();
  if (check.status) {
    const response = await updateEnterpriseMember({
      id: props.user?.id ?? '',
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      active: userData.active === 'Ativo' ? 1 : 0,
      position: userData.position,
    });

    if (response?.status === 200) {
      emit('update:open');
      clear();
    }
  } else {
    Notify.create({
      message: check.message || 'Erro ao atualizar organização',
      type: 'negative',
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
    mountUserEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage :title="'Editar Membro'" />
      </q-card-section>
      <q-card-section>
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="userData.name"
            label="Nome"
            bg-color="white"
            label-color="black"
            outlined
            dense
            input-class="text-black"
          />
          <q-input
            v-model="userData.email"
            label="Email"
            bg-color="white"
            label-color="black"
            outlined
            dense
            input-class="text-black"
          />
          <q-input
            v-model="userData.phone"
            label="Telefone"
            bg-color="white"
            label-color="black"
            outlined
            dense
            input-class="text-black"
          />
          <q-input
            v-model="userData.active"
            label="Status"
            bg-color="white"
            label-color="black"
            outlined
            dense
            input-class="text-black"
          />
          <q-input
            v-model="userData.position"
            label="Cargo"
            bg-color="white"
            label-color="black"
            outlined
            dense
            input-class="text-black"
          />
        </q-form>
      </q-card-section>
      <q-card-actions class="border-top">
        <div class="row justify-end full-width">
          <div class="q-gutter-x-sm">
            <q-btn
              @click="open = false"
              color="red"
              label="Fechar"
              size="md"
              unelevated
              no-caps
              flat
            />
            <q-btn
              @click="updateMember"
              color="primary"
              label="Atualizar"
              size="md"
              :loading="loadingEnterprise"
              unelevated
              no-caps
            />
            <q-btn @click="exclude(props.row.id)" size="sm" flat round color="red" icon="delete" />
          </div>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
