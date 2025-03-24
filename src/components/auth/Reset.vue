<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/stores/auth-store';
import TitleAuth from '../shared/TitleAuth.vue';
import type { RenderAuth, StatusReset } from 'src/ts/types/Auth';
import { checkDataReset, checkPassword } from 'src/helpers/checkData';

defineOptions({
  name: 'ResetPassword',
});

const emit = defineEmits<{
  'update:changeRender': [RenderAuth];
}>();

const { loadingAuth } = storeToRefs(useAuthStore());

const dataReset = reactive({
  email: '' as string,
  code: '' as string,
  password: '' as string,
  passwordConfirm: '' as string,
});
const modeView = ref<StatusReset>('setEmail');
const isPwd = ref<boolean>(true);
const isPwd2 = ref<boolean>(true);

const clear = (): void => {
  Object.assign(dataReset, {
    email: '',
    code: '',
    password: '',
    passwordConfirm: '',
  });
};
const changeRender = (render: RenderAuth): void => {
  emit('update:changeRender', render);
};
const sendEmailReset = async () => {
  const verifyData = checkDataReset(dataReset.email);
  if (!verifyData.status) {
    Notify.create({
      message: verifyData.message || 'Ocorreu um erro ao resetar senha',
      type: 'negative',
    });
  } else {
    const response = await useAuthStore().doReset(dataReset.email);
    if (response?.status === 200) {
      modeView.value = 'setCode';
    }
  }
};
const verifyCode = async () => {
  const response = await useAuthStore().doVerify(dataReset.code, dataReset.email);
  if (response?.status === 200) {
    modeView.value = 'setPassword';
  }
};
const newPassword = async () => {
  const check = checkPassword(dataReset);
  if (check.status) {
    const response = await useAuthStore().setNewPassword(dataReset.password, dataReset.email);
    if (response?.status === 200) {
      emit('update:changeRender', 'login');
      clear();
    }
  } else {
    Notify.create({
      message: check.message || 'Ocorreu um erro ao salvar nova senha',
      type: 'negative',
    });
  }
};

watch(
  modeView,
  (mode) => {
    if (mode === 'setEmail') {
      clear();
    }
  },
  { immediate: true },
);

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
      <TitleAuth title="Recupere sua senha" />
    </div>
    <div class="q-pb-sm q-px-md q-gutter-y-sm">
      <q-input
        v-if="modeView === 'setEmail'"
        v-model="dataReset.email"
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
        v-else-if="modeView === 'setCode'"
        v-model="dataReset.code"
        bg-color="white"
        label-color="black"
        filled
        label="Digite o código enviado para o e-mail "
        dense
        input-class="text-black"
      >
        <template v-slot:prepend>
          <q-icon name="vpn_key" color="black" size="20px" />
        </template>
      </q-input>
      <div v-else class="column q-gutter-y-sm">
        <q-input
          v-model="dataReset.password"
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
        <q-input
          v-model="dataReset.passwordConfirm"
          bg-color="white"
          label-color="black"
          filled
          label="Confirme sua senha"
          autocomplete="new-password"
          dense
          input-class="text-black"
          :type="isPwd2 ? 'password' : 'text'"
        >
          <template v-slot:append>
            <q-icon
              @click="isPwd2 = !isPwd2"
              :name="isPwd2 ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              size="20px"
            />
          </template>
          <template v-slot:prepend>
            <q-icon name="key" color="black" size="20px" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="q-pb-sm q-px-md row justify-end items-center q-gutter-x-sm">
      <q-btn @click="changeRender('login')" color="black" label="Entrar" size="md" no-caps flat />
      <q-btn
        v-show="modeView === 'setEmail'"
        @click="sendEmailReset"
        color="red-6"
        label="Enviar"
        size="md"
        :loading="loadingAuth"
        unelevated
        no-caps
      />
      <q-btn
        v-show="modeView === 'setCode'"
        @click="verifyCode"
        color="red-6"
        label="Verificar"
        size="md"
        :loading="loadingAuth"
        unelevated
        no-caps
      />
      <q-btn
        v-show="modeView === 'setPassword'"
        @click="newPassword"
        color="red-6"
        label="Salvar"
        size="md"
        :loading="loadingAuth"
        unelevated
        no-caps
      />
    </div>
  </q-form>
</template>
