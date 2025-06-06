import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import type { Router } from 'vue-router';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

export default store((/* { ssrContext } */) => {
  const pinia = createPinia();

  return pinia;
});
