<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/stores/auth-store';
import TitleAuth from '../shared/TitleAuth.vue';
import type { RenderAuth } from 'src/ts/types/Auth';

defineOptions({
  name: 'Login',
});

const emit = defineEmits<{
  'update:changeRender': [RenderAuth];
}>();

const { loadingAuth } = storeToRefs(useAuthStore());

const isPwd = ref<boolean>(true);
const dataLogin = reactive({
  email: '' as string,
  password: '' as string,
});

const clear = (): void => {
  Object.assign(dataLogin, {
    email: '',
    password: '',
  });
};
const changeRender = (render: RenderAuth): void => {
  emit('update:changeRender', render);
};
const checkData = (): { status: boolean; message?: string } => {
  if (dataLogin.email.trim() === '') {
    return { status: false, message: 'Deve ser informado o e-mail' };
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(dataLogin.email.trim())) {
    return { status: false, message: 'Informe um e-mail válido' };
  }
  if (dataLogin.password.trim() === '') {
    return { status: false, message: 'Deve ser informado uma senha' };
  }
  return { status: true };
};
const login = async () => {
  const check = checkData();
  if (check.status) {
    await useAuthStore().doLogin(dataLogin.email, dataLogin.password);
  } else {
    Notify.create({
      message: check.message || 'Ocorreu um erro no login',
      type: 'negative',
    });
  }
};

onMounted(() => {
  clear();
});
</script>

<template>
  <q-form class="form-auth rounded-borders bg-grey-3">
    <div class="row justify-center items-center q-pa-md">
      <q-img src="/images/logo/logo.png" spinner-color="white" width="350px" height="90px" />
    </div>
    <div class="q-px-md">
      <TitleAuth title="Faça seu login" />
    </div>
    <div class="q-pb-sm q-px-md q-gutter-y-sm">
      <q-input
        v-model="dataLogin.email"
        bg-color="white"
        label-color="black"
        filled
        label="Digite seu e-mail"
        autocomplete="new-email"
        dense
        input-class="text-black"
      >
        <template v-slot:prepend>
          <q-icon name="email" color="black" size="20px" />
        </template>
      </q-input>
      <q-input
        v-model="dataLogin.password"
        bg-color="white"
        label-color="black"
        filled
        label="Digite sua senha"
        autocomplete="new-password"
        dense
        input-class="text-black"
        :type="isPwd ? 'password' : 'text'"
      >
        <template v-slot:append>
          <q-icon
            @click="isPwd = !isPwd"
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            size="20px"
          />
        </template>
        <template v-slot:prepend>
          <q-icon name="key" color="black" size="20px" />
        </template>
      </q-input>
    </div>
    <div class="q-pb-sm q-px-md row justify-end items-center q-gutter-x-sm">
      <q-btn
        color="black"
        label="Esqueceu senha"
        size="md"
        flat
        @click="changeRender('reset')"
        no-caps
      />
      <q-btn
        @click="login"
        color="red-6"
        label="Entrar"
        size="md"
        :loading="loadingAuth"
        unelevated
        no-caps
      />
    </div>
  </q-form>
</template>
