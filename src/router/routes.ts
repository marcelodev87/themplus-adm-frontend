import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'auth',
    component: () => import('src/pages/Auth.vue'),
  },
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      // {
      //   path: 'dashboard',
      //   name: 'admin-dashboard',
      //   component: () => import('src/pages/Dashboard.vue'),
      // },
      {
        path: 'organizacoes',
        name: 'admin-enterprise',
        component: () => import('src/pages/Enterprise.vue'),
      },
      {
        path: 'usuarios',
        name: 'admin-users',
        component: () => import('src/pages/User.vue'),
      },
      {
        path: 'cupons',
        name: 'admin-coupon',
        component: () => import('src/pages/Coupon.vue'),
      },
      // {
      //   path: 'atividades',
      //   name: 'admin-record',
      //   component: () => import('src/pages/Activity.vue'),
      // },
      {
        path: 'departamentos',
        name: 'admin-departments',
        component: () => import('src/pages/Department.vue'),
      },
      {
        path: 'assinaturas',
        name: 'admin-subscription',
        component: () => import('src/pages/Subscriptions.vue'),
      },
      {
        path: 'feedbacks',
        name: 'admin-feedbacks',
        component: () => import('src/pages/Feedback.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/error/ErrorNotFound.vue'),
  },
];

export default routes;
