import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'auth',
    component: () => import('src/pages/Auth.vue'),
  },
  {
    path: '/admin',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: { name: 'admin-feed' },
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('src/pages/Dashboard.vue'),
      },
      {
        path: 'organizações',
        name: 'admin-enterprise',
        component: () => import('src/pages/Enterprise.vue'),
      },
      {
        path: 'coupon',
        name: 'admin-coupon',
        component: () => import('src/pages/Coupon.vue'),
      },
      {
        path: 'panel',
        name: 'admin-panel',
        component: () => import('src/pages/Panel.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/error/ErrorNotFound.vue'),
  },
];

export default routes;
