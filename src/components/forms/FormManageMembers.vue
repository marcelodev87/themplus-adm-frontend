<script lang="ts" setup>
import { computed, reactive, watch } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import type { User } from 'src/ts/interfaces/models/user';
import { storeToRefs } from 'pinia';
import { useUsersMembersStore } from 'src/stores/users-store';
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

const { loadingUsersMembers } = storeToRefs(useUsersMembersStore());
const { updateEnterpriseMember } = useUsersMembersStore();

const dataUser = reactive({
  name: '' as string,
  email: '' as string,
  phone: '' as string,
  active: '' as string,
  position: '' as string,
});

const checkData = (): { status: boolean; message?: string } => {
  if (dataUser.name.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o nome da organização',
    };
  }
  if (dataUser.name.trim().length < 2) {
    return {
      status: false,
      message: 'Nome da organização deve ter mais de 2 caracteres',
    };
  }
  if (
    dataUser.email.trim() === '' ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(dataUser.email.trim())
  ) {
    return { status: false, message: 'Informe um e-mail válido para sua organização' };
  }

  return { status: true };
};
const clear = (): void => {
  Object.assign(dataUser, {
    name: '',
    email: '',
    phone: '',
    active: '',
    position: '',
  });
};
const mountUserEdit = () => {
  Object.assign(dataUser, {
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
    const response = await updateEnterpriseMember(
      props.user?.id ?? '',
      dataUser.name,
      dataUser.email,
      dataUser.phone,
    );

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
const formattedPhoneEnterprise = computed({
  get() {
    let phone = '';
    if (dataUser.phone.trim() !== '') {
      phone = dataUser.phone.replace(/\D/g, '');
    }
    if (phone.length === 10) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`;
    }
    if (phone.length === 11) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
    }
    return phone;
  },
  set(value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 11) {
      return;
    }
    dataUser.phone = digits;
  },
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
        <TitlePage title="Editar membro" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataUser.name"
            label="Nome"
            bg-color="white"
            label-color="black"
            outlined
            dense
            input-class="text-black"
          />
          <q-input
            v-model="dataUser.email"
            label="Email"
            bg-color="white"
            label-color="black"
            outlined
            dense
            input-class="text-black"
          />
          <q-input
            v-model="formattedPhoneEnterprise"
            label="Telefone"
            bg-color="white"
            label-color="black"
            outlined
            dense
            input-class="text-black"
          />
          <q-input
            v-model="dataUser.active"
            label="Status"
            bg-color="white"
            label-color="black"
            outlined
            dense
            input-class="text-black"
            disable
          />
          <q-input
            v-model="dataUser.position"
            label="Cargo"
            bg-color="white"
            label-color="black"
            outlined
            dense
            input-class="text-black"
            disable
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
              :loading="loadingUsersMembers"
              unelevated
              no-caps
            />
          </div>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
