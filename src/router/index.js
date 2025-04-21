import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import WaveView from '@/views/separation/WaveView.vue'
import ZoneView from '@/views/separation/ZoneView.vue'
import BatchView from '@/views/separation/BatchView.vue'
import { useUserStore } from '@/stores/user'
import { verificarSessao } from '@/services/authService'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }  // ← ROTAS PROTEGIDAS
  },
  {
    path: '/wave',
    name: 'wave',
    component: WaveView,
    meta: { requiresAuth: true }  // ← ROTAS PROTEGIDAS
  },
  {
    path: '/zone',
    name: 'zone',
    component: ZoneView,
    meta: { requiresAuth: true }  // ← ROTAS PROTEGIDAS
  },
  {
    path: '/batch',
    name: 'batch',
    component: BatchView,
    meta: { requiresAuth: true }  // ← ROTAS PROTEGIDAS
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // Se não exige autenticação, pode passar direto
  if (!to.meta.requiresAuth) {
    return next()
  }

  // Carrega dados locais, se houver
  userStore.carregarUsuario()

  try {
    // Se há dados e sessão válida → segue
    const validar = await verificarSessao()
    if (validar.status) {
      return next()
    }
  } catch (e) {
    // Sessão inválida
  }

  // Qualquer falha → volta pro login
  return next('/login')
})

router.afterEach((to) => {
  if (to.name !== 'login') {
    localStorage.setItem('rotaAtual', to.fullPath)
  }
})

export default router
