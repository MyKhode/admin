import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' }, // Changed redirect to /login
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'account-settings',
        component: () => import('@/pages/account-settings.vue'),
        meta: { requiresAuth: true }, // Added requiresAuth
      },
      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
        meta: { requiresAuth: true }, // Added requiresAuth
      },
      {
        path: 'icons',
        component: () => import('@/pages/icons.vue'),
        meta: { requiresAuth: true }, // Added requiresAuth
      },
      {
        path: 'cards',
        component: () => import('@/pages/cards.vue'),
        meta: { requiresAuth: true }, // Added requiresAuth
      },
      {
        path: 'tables',
        component: () => import('@/pages/tables.vue'),
        meta: { requiresAuth: true }, // Added requiresAuth
      },
      {
        path: 'form-layouts',
        component: () => import('@/pages/form-layouts.vue'),
        meta: { requiresAuth: true }, // Added requiresAuth
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/pages/login.vue'),
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
