<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { searchCep } from 'src/services/cep-service';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import { storeToRefs } from 'pinia';
import type { Enterprise } from 'src/ts/interfaces/models/enterprise';

defineOptions({
  name: 'FormEnterprise',
});

const props = defineProps<{
  open: boolean;
  data: Enterprise | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { createEnterpriseByAdm, updateEnterpriseByAdm } = useEnterpriseStore();
const { loadingEnterprise } = storeToRefs(useEnterpriseStore());

const allowRequest = ref<boolean>(false);
const isPwd = ref<boolean>(true);
const isPwd2 = ref<boolean>(true);
const loadingCep = ref<boolean>(false);
const splitterModel = ref<number>(300);
const tab = ref<'enterprise' | 'user'>('enterprise');
const selectedIdentifier = ref<string>('CNPJ');
const dataEnterprise = reactive({
  name: '' as string,
  email: '' as string,
  cnpj: '' as string,
  cpf: '' as string,
  cep: '' as string,
  state: '' as string,
  city: '' as string,
  neighborhood: '' as string,
  address: '' as string,
  numberAddress: '' as string,
  complement: '' as string,
  phone: '' as string,
  codeFinancial: '' as string,
  position: 'Cliente' as string,
});
const dataUser = reactive({
  name: '' as string,
  position: 'common_user' as string,
  phone: '' as string,
  email: '' as string,
  password: '' as string,
  confirmPassword: '' as string,
});
const optionsIdentifier = reactive<string[]>(['CNPJ', 'CPF']);

const checkData = (): { status: boolean; message?: string } => {
  if (dataEnterprise.name.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o nome da organização',
    };
  }
  if (dataEnterprise.name.trim().length < 2) {
    return {
      status: false,
      message: 'Nome da organização deve ter mais de 2 caracteres',
    };
  }
  if (
    dataEnterprise.email.trim() === '' ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(dataEnterprise.email.trim())
  ) {
    return { status: false, message: 'Informe um e-mail válido para sua organização' };
  }
  if (dataEnterprise.phone?.trim() !== '') {
    if (!/^\+?[1-9]\d{1,14}$/.test(dataEnterprise.phone?.trim())) {
      return { status: false, message: 'Digite um telefone válido para sua organização' };
    }
  }
  if (selectedIdentifier.value === 'CPF' && dataEnterprise.cpf.trim().length !== 11) {
    return {
      status: false,
      message: 'Informe um CPF válido para sua organização',
    };
  }
  if (selectedIdentifier.value === 'CNPJ' && dataEnterprise.cnpj.trim().length !== 14) {
    return {
      status: false,
      message: 'Informe um CNPJ válido para sua organização',
    };
  }
  if (dataEnterprise.cep.trim() === '' || dataEnterprise.cep.trim().length !== 8) {
    return {
      status: false,
      message: 'Informe um CEP válido',
    };
  }
  if (dataEnterprise.state.trim() === '') {
    return {
      status: false,
      message: 'Informe um UF válido',
    };
  }
  if (dataEnterprise.city.trim() === '') {
    return {
      status: false,
      message: 'Informe uma cidade válida',
    };
  }
  if (dataEnterprise.neighborhood.trim() === '') {
    return {
      status: false,
      message: 'Informe um bairro válido',
    };
  }
  if (dataEnterprise.address.trim() === '') {
    return {
      status: false,
      message: 'Informe um logradouro válido',
    };
  }
  if (dataEnterprise.numberAddress.trim() === '') {
    return {
      status: false,
      message: 'Informe um número de endereço válido',
    };
  }
  if (props.data === null) {
    if (dataUser.name.trim() === '') {
      return {
        status: false,
        message: 'Deve ser informado o nome do usuário para iniciar a organização',
      };
    }
    if (dataUser.name.trim().length < 2) {
      return {
        status: false,
        message: 'Nome de usuário deve ter mais de 2 caracteres',
      };
    }
    if (dataUser.email.trim() === '') {
      return { status: false, message: 'Deve ser informado o e-mail do usuário' };
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(dataUser.email.trim())) {
      return { status: false, message: 'Informe um e-mail válido para seu usuário' };
    }
    if (dataUser.phone.trim() !== '') {
      if (!/^\+?[1-9]\d{1,14}$/.test(dataUser.phone.trim())) {
        return { status: false, message: 'Digite um telefone válido para seu usuário' };
      }
    }
    if (dataUser.password.trim() === '') {
      return {
        status: false,
        message: 'Deve ser informado a senha do usuário',
      };
    }
    if (dataUser.password.trim().length < 7) {
      return {
        status: false,
        message: 'A senha deve conter mais de 7 caracteres',
      };
    }
    if (
      dataUser.password.trim() !== (dataUser.confirmPassword && dataUser.confirmPassword.trim())
    ) {
      return { status: false, message: 'As senhas não coincidem' };
    }
  }

  return { status: true };
};
const clear = (): void => {
  Object.assign(dataEnterprise, {
    name: '',
    email: '',
    cnpj: '',
    cpf: '',
    cep: '',
    state: '',
    city: '',
    neighborhood: '',
    address: '',
    numberAddress: '',
    complement: '',
    phone: '',
    codeFinancial: '',
    position: 'Cliente',
  });
  Object.assign(dataUser, {
    name: '',
    position: 'common_user',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  tab.value = 'enterprise';
  allowRequest.value = false;
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    const response = await createEnterpriseByAdm(
      {
        name: dataEnterprise.name,
        email: dataEnterprise.email,
        cnpj: selectedIdentifier.value === 'CNPJ' ? dataEnterprise.cnpj : null,
        cpf: selectedIdentifier.value === 'CPF' ? dataEnterprise.cpf : null,
        cep: dataEnterprise.cep,
        state: dataEnterprise.state,
        city: dataEnterprise.city,
        neighborhood: dataEnterprise.neighborhood,
        address: dataEnterprise.address,
        complement: dataEnterprise.complement.trim() === '' ? null : dataEnterprise.complement,
        numberAddress: dataEnterprise.numberAddress,
        phone: dataEnterprise.phone.trim() === '' ? null : dataEnterprise.phone,
        codeFinancial:
          dataEnterprise.codeFinancial.trim() === '' ? null : Number(dataEnterprise.codeFinancial),
        position: dataEnterprise.position == 'Cliente' ? 'client' : 'counter',
      },
      {
        name: dataUser.name,
        position: dataUser.position,
        email: dataUser.email,
        password: dataUser.password,
        phone: dataUser.phone?.trim() !== '' ? dataUser.phone : null,
      },
    );

    if (response?.status === 201) {
      emit('update:open');
      clear();
    }
  } else {
    Notify.create({
      message: check.message || 'Erro ao criar organização',
      type: 'negative',
    });
  }
};
const update = async () => {
  const check = checkData();
  if (check.status) {
    const response = await updateEnterpriseByAdm({
      id: props.data?.id ?? '',
      name: dataEnterprise.name,
      cnpj:
        selectedIdentifier.value === 'CNPJ'
          ? dataEnterprise.cnpj.trim() === ''
            ? null
            : dataEnterprise.cnpj
          : null,
      cpf:
        selectedIdentifier.value === 'CPF'
          ? dataEnterprise.cpf.trim() === ''
            ? null
            : dataEnterprise.cpf
          : null,
      cep: dataEnterprise.cep.trim() === '' ? null : dataEnterprise.cep,
      state: dataEnterprise.state.trim() === '' ? null : dataEnterprise.state,
      city: dataEnterprise.city.trim() === '' ? null : dataEnterprise.city,
      neighborhood: dataEnterprise.neighborhood.trim() === '' ? null : dataEnterprise.neighborhood,
      address: dataEnterprise.address.trim() === '' ? null : dataEnterprise.address,
      complement: dataEnterprise.complement.trim() === '' ? null : dataEnterprise.complement,
      number_address:
        dataEnterprise.numberAddress.trim() === '' ? null : dataEnterprise.numberAddress,
      email: dataEnterprise.email.trim() === '' ? null : dataEnterprise.email,
      phone: dataEnterprise.phone.trim() === '' ? null : dataEnterprise.phone,
    });

    if (response?.status === 200) {
      emit('update:open');
      clear();
    }
  } else {
    Notify.create({
      message: check.message || 'Erro ao criar organização',
      type: 'negative',
    });
  }
};
const formattedPhoneEnterprise = computed({
  get() {
    let phone = '';
    if (dataEnterprise.phone.trim() !== '') {
      phone = dataEnterprise.phone.replace(/\D/g, '');
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
    dataEnterprise.phone = digits;
  },
});
const formattedPhoneUser = computed({
  get() {
    const phone = dataUser.phone.replace(/\D/g, '');
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
const checkEdit = () => {
  if (props.data) {
    selectedIdentifier.value = props.data.cpf ? 'CPF' : 'CNPJ';

    Object.assign(dataEnterprise, {
      name: props.data.name ?? '',
      email: props.data.email ?? '',
      cnpj: props.data.cnpj ?? '',
      cpf: props.data.cpf ?? '',
      cep: props.data.cep ?? '',
      state: props.data.state ?? '',
      city: props.data.city ?? '',
      neighborhood: props.data.neighborhood ?? '',
      address: props.data.address ?? '',
      numberAddress: props.data.number_address ?? '',
      complement: props.data.complement ?? '',
      phone: props.data.phone ?? '',
      codeFinancial: props.data.code_financial ?? '',
      position: props.data.postion == 'client' ? 'Cliente' : 'Contador',
    });
  }
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch([() => dataEnterprise.cep, allowRequest], async ([cep, allowRequest]: [string, boolean]) => {
  if (allowRequest) {
    dataEnterprise.cep = dataEnterprise.cep.replace(/\D/g, '');
    if (cep.trim().length === 8) {
      loadingCep.value = true;
      const response = await searchCep(cep);
      if (response.status === 200) {
        dataEnterprise.neighborhood = response.data.bairro;
        dataEnterprise.state = response.data.estado;
        dataEnterprise.city = response.data.localidade;
        dataEnterprise.address = response.data.logradouro;
      }
    } else {
      dataEnterprise.neighborhood = '';
      dataEnterprise.state = '';
      dataEnterprise.city = '';
      dataEnterprise.address = '';
    }
  }
  loadingCep.value = false;
});
watch(
  [() => dataEnterprise.cpf, () => dataEnterprise.cnpj, () => dataEnterprise.numberAddress],
  ([cpf, cnpj, numberAdress]) => {
    if (dataEnterprise.cpf && dataEnterprise.cpf.trim() !== '') {
      dataEnterprise.cpf = cpf.replace(/\D/g, '');
    }
    if (dataEnterprise.cnpj && dataEnterprise.cnpj.trim() !== '') {
      dataEnterprise.cnpj = cnpj.replace(/\D/g, '');
    }
    if (dataEnterprise.numberAddress && dataEnterprise.numberAddress.trim() !== '') {
      dataEnterprise.numberAddress = numberAdress.replace(/\D/g, '');
    }
  },
);
watch(
  selectedIdentifier,
  (identifier: string) => {
    if (identifier === 'CPF') {
      dataEnterprise.cnpj = '';
    } else {
      dataEnterprise.cpf = '';
    }
  },
  { immediate: true },
);
watch(open, () => {
  if (open.value) {
    clear();
    checkEdit();
    allowRequest.value = true
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2" style="min-width: 90vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Registro de organização" />
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-splitter
          v-model="splitterModel"
          style="height: 400px"
          unit="px"
          :limits="[130, 130]"
          class="bg-grey-2"
        >
          <template v-slot:before>
            <q-tabs v-model="tab" vertical class="bg-grey-2">
              <q-tab name="enterprise" icon="work" label="Organização" no-caps />
              <q-tab
                name="user"
                icon="person"
                label="Usuário"
                no-caps
                v-show="props.data === null"
              />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels
              v-model="tab"
              animated
              swipeable
              vertical
              transition-prev="jump-up"
              transition-next="jump-up"
            >
              <q-tab-panel name="enterprise" class="bg-grey-2">
                <q-form class="q-gutter-y-sm">
                  <q-select
                    v-model="dataEnterprise.position"
                    :options="['Cliente', 'Contador']"
                    label="Tipo de organização"
                    filled
                    dense
                    options-dense
                    map-options
                    bg-color="white"
                    label-color="black"
                    class="full-width"
                    :readonly="props.data !== null"
                  >
                    <template v-slot:prepend>
                      <q-icon name="verified" color="black" size="20px" />
                    </template>
                  </q-select>
                  <q-input
                    v-model="dataEnterprise.name"
                    bg-color="white"
                    label-color="black"
                    outlined
                    label="Nome da organização"
                    dense
                    input-class="text-black"
                    :readonly="loadingCep || loadingEnterprise"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" color="black" size="20px" />
                    </template>
                  </q-input>
                  <q-input
                    v-model="dataEnterprise.email"
                    bg-color="white"
                    label-color="black"
                    outlined
                    label="E-mail da organização"
                    dense
                    input-class="text-black"
                    :readonly="loadingCep || loadingEnterprise"
                  >
                    <template v-slot:prepend>
                      <q-icon name="mail" color="black" size="20px" />
                    </template>
                  </q-input>
                  <div class="row justify-between">
                    <q-input
                      v-model="formattedPhoneEnterprise"
                      bg-color="white"
                      label-color="black"
                      outlined
                      label="Telefone da organização"
                      dense
                      input-class="text-black"
                      class="input-divider"
                      :readonly="loadingCep || loadingEnterprise"
                    >
                      <template v-slot:prepend>
                        <q-icon name="call" color="black" size="20px" />
                      </template>
                    </q-input>
                    <q-input
                      v-model="dataEnterprise.codeFinancial"
                      bg-color="white"
                      label-color="black"
                      outlined
                      label="Digite o código interno"
                      dense
                      input-class="text-black"
                      mask="##########"
                      class="input-divider"
                    >
                      <template v-slot:prepend>
                        <q-icon name="key" color="black" size="20px" />
                      </template>
                    </q-input>
                  </div>
                  <div class="row justify-between">
                    <q-select
                      v-model="selectedIdentifier"
                      :options="optionsIdentifier"
                      label="Selecione o documento"
                      outlined
                      dense
                      options-dense
                      bg-color="white"
                      label-color="black"
                      class="input-divider"
                      :readonly="loadingCep || loadingEnterprise"
                    >
                      <template v-slot:prepend>
                        <q-icon name="info" color="black" size="20px" />
                      </template>
                    </q-select>
                    <q-input
                      v-if="selectedIdentifier === 'CNPJ'"
                      v-model="dataEnterprise.cnpj"
                      bg-color="white"
                      label-color="black"
                      outlined
                      label="Digite o CNPJ"
                      dense
                      input-class="text-black"
                      class="input-divider"
                      maxlength="14"
                      :readonly="loadingCep || loadingEnterprise"
                    >
                      <template v-slot:prepend>
                        <q-icon name="badge" color="black" size="20px" />
                      </template>
                    </q-input>
                    <q-input
                      v-else
                      v-model="dataEnterprise.cpf"
                      bg-color="white"
                      label-color="black"
                      outlined
                      label="Digite o CPF"
                      dense
                      input-class="text-black"
                      class="input-divider"
                      maxlength="11"
                      :readonly="loadingCep || loadingEnterprise"
                    >
                      <template v-slot:prepend>
                        <q-icon name="badge" color="black" size="20px" />
                      </template>
                    </q-input>
                  </div>
                  <q-input
                    v-model="dataEnterprise.cep"
                    bg-color="white"
                    label-color="black"
                    outlined
                    label="Digite o CEP"
                    dense
                    input-class="text-black"
                    :loading="loadingCep"
                    maxlength="8"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" color="black" size="20px" />
                    </template>
                  </q-input>
                  <div class="row justify-between">
                    <q-input
                      v-model="dataEnterprise.state"
                      bg-color="white"
                      label-color="black"
                      outlined
                      label="UF"
                      dense
                      input-class="text-black"
                      class="input-divider"
                      :readonly="loadingCep || loadingEnterprise"
                    >
                      <template v-slot:prepend>
                        <q-icon name="map" color="black" size="20px" />
                      </template>
                    </q-input>
                    <q-input
                      v-model="dataEnterprise.city"
                      bg-color="white"
                      label-color="black"
                      outlined
                      label="Cidade"
                      dense
                      input-class="text-black"
                      class="input-divider"
                      :readonly="loadingCep || loadingEnterprise"
                    >
                      <template v-slot:prepend>
                        <q-icon name="pin_drop" color="black" size="20px" />
                      </template>
                    </q-input>
                  </div>
                  <q-input
                    v-model="dataEnterprise.neighborhood"
                    bg-color="white"
                    label-color="black"
                    outlined
                    label="Bairro"
                    dense
                    input-class="text-black"
                    :readonly="loadingCep || loadingEnterprise"
                  >
                    <template v-slot:prepend>
                      <q-icon name="pin_drop" color="black" size="20px" />
                    </template>
                  </q-input>
                  <q-input
                    v-model="dataEnterprise.address"
                    bg-color="white"
                    label-color="black"
                    outlined
                    label="Logradouro"
                    dense
                    input-class="text-black"
                    :readonly="loadingCep || loadingEnterprise"
                  >
                    <template v-slot:prepend>
                      <q-icon name="pin_drop" color="black" size="20px" />
                    </template>
                  </q-input>
                  <div class="row justify-between">
                    <q-input
                      v-model="dataEnterprise.numberAddress"
                      bg-color="white"
                      label-color="black"
                      outlined
                      label="Número"
                      dense
                      input-class="text-black"
                      class="input-divider"
                      maxlength="15"
                      :readonly="loadingCep || loadingEnterprise"
                    >
                      <template v-slot:prepend>
                        <q-icon name="numbers" color="black" size="20px" />
                      </template>
                    </q-input>
                    <q-input
                      v-model="dataEnterprise.complement"
                      bg-color="white"
                      label-color="black"
                      outlined
                      label="Complemento"
                      dense
                      input-class="text-black"
                      class="input-divider"
                      :readonly="loadingCep || loadingEnterprise"
                    >
                      <template v-slot:prepend>
                        <q-icon name="numbers" color="black" size="20px" />
                      </template>
                    </q-input>
                  </div>
                </q-form>
              </q-tab-panel>

              <q-tab-panel name="user" class="bg-grey-2">
                <q-form class="q-gutter-y-sm">
                  <q-input
                    v-model="dataUser.name"
                    bg-color="white"
                    label-color="black"
                    outlined
                    label="Digite o nome do usuário"
                    dense
                    input-class="text-black"
                    :readonly="loadingEnterprise"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" color="black" size="20px" />
                    </template>
                  </q-input>
                  <q-input
                    v-model="dataUser.email"
                    bg-color="white"
                    label-color="black"
                    outlined
                    label="Digite o e-mail do usuário"
                    dense
                    input-class="text-black"
                    :readonly="loadingEnterprise"
                  >
                    <template v-slot:prepend>
                      <q-icon name="mail" color="black" size="20px" />
                    </template>
                  </q-input>
                  <q-input
                    v-model="formattedPhoneUser"
                    bg-color="white"
                    label-color="black"
                    outlined
                    label="Digite o telefone do usuário"
                    dense
                    input-class="text-black"
                    :readonly="loadingEnterprise"
                  >
                    <template v-slot:prepend>
                      <q-icon name="call" color="black" size="20px" />
                    </template>
                  </q-input>
                  <q-input
                    v-model="dataUser.password"
                    bg-color="white"
                    label-color="black"
                    outlined
                    label="Digite a senha do usuário"
                    dense
                    input-class="text-black"
                    :type="isPwd ? 'password' : 'text'"
                    :readonly="loadingEnterprise"
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
                      <q-icon name="lock" color="black" size="20px" />
                    </template>
                  </q-input>
                  <q-input
                    v-model="dataUser.confirmPassword"
                    bg-color="white"
                    label-color="black"
                    outlined
                    label="Confirme a senha do usuário"
                    dense
                    input-class="text-black"
                    :type="isPwd ? 'password' : 'text'"
                    :readonly="loadingEnterprise"
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
                      <q-icon name="lock" color="black" size="20px" />
                    </template>
                  </q-input>
                </q-form>
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </q-card-section>
      <q-card-actions class="border-top">
        <div class="row justify-end full-width">
          <div class="q-gutter-x-sm">
            <q-btn
              color="red"
              label="Fechar"
              size="md"
              flat
              @click="open = false"
              unelevated
              no-caps
            />
            <q-btn
              v-if="props.data === null"
              @click="save"
              color="primary"
              label="Salvar"
              size="md"
              :loading="loadingEnterprise || loadingCep"
              unelevated
              no-caps
            />
            <q-btn
              v-else
              @click="update"
              color="primary"
              label="Atualizar"
              size="md"
              :loading="loadingEnterprise || loadingCep"
              unelevated
              no-caps
            />
          </div>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
