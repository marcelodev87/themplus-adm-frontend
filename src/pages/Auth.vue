<script setup lang="ts">
import Login from 'src/components/auth/Login.vue';
import Reset from 'src/components/auth/Reset.vue';
import type { RenderAuth } from 'src/ts/types/Auth';
import { ref } from 'vue';

defineOptions({
  name: 'Auth',
});

const render = ref<RenderAuth>('login');

const handleChangeRender = (value: RenderAuth) => {
  render.value = value;
};
</script>
<template>
  <section class="container-view row justify-center items-center background-auth">
    <Login v-if="render == 'login'" @update:change-render="handleChangeRender" />
    <Reset v-else @update:change-render="handleChangeRender" />
  </section>
</template>
