import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('../views/Home.vue'), meta: { auth: true } },
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/register', component: () => import('../views/Register.vue') },
  { path: '/stages', component: () => import('../views/StageTracker.vue'), meta: { auth: true } },
  { path: '/timer', component: () => import('../views/Timer.vue'), meta: { auth: true } },
  { path: '/timer/:concept', component: () => import('../views/Timer.vue'), meta: { auth: true } },
  { path: '/sessions', component: () => import('../views/Sessions.vue'), meta: { auth: true } },
  { path: '/concepts', component: () => import('../views/Concepts.vue'), meta: { auth: true } },
  { path: '/journal', component: () => import('../views/Journal.vue'), meta: { auth: true } },
  { path: '/forum', component: () => import('../views/Forum.vue'), meta: { auth: true } },
  { path: '/forum/new', component: () => import('../views/NewPost.vue'), meta: { auth: true } },
  { path: '/forum/:id', component: () => import('../views/ForumPost.vue'), meta: { auth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const token = localStorage.getItem('mb_token');
  if (to.meta.auth && !token) {
    return { path: '/login', query: { next: to.fullPath } };
  }
  if ((to.path === '/login' || to.path === '/register') && token) {
    return { path: '/' };
  }
});
