<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { useQuasar } from 'quasar';

defineOptions({
  name: 'Department',
});

const $q = useQuasar();
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
          <!-- <q-tree
            v-model:selected="selectedObject"
            :nodes="[]"
            :filter="filterDepartment"
            node-key="id"
            class="full-width text-subtitle1"
          >
            <template v-slot:default-header="prop">
              <div class="row full-width wrap justify-between content-start">
                <div class="row items-center justify-center">
                  <q-icon name="groups" color="black" size="22px" class="q-mr-sm" />
                  <q-btn size="sm" flat rounded color="black" :disable="false">
                    {{ prop.node.label }}
                  </q-btn>
                </div>
                <q-separator />
                <div class="row items-center justify-center">
                  <q-btn
                    :label="!$q.screen.lt.sm ? 'Adicionar um sub-departamento' : ''"
                    :disable="false"
                    size="sm"
                    rounded
                    flat
                    icon="add"
                    unelevated
                  />
                  <q-btn :disable="false" size="sm" flat rounded color="negative" icon="delete" />
                </div>
              </div>
            </template>
          </q-tree> -->
          <div v-show="true" class="q-pa-md full-width">
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
  </section>
</template>

<style>
.teste {
  border: 1px solid black;
}
</style>
