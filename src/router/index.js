import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import HomeAndroidView from '@/views/android/HomeAndroidView.vue'
import HomeWebView from '@/views/HomeWebView.vue'
import WaveView from '@/views/android/separation/WaveView.vue'
import ZoneView from '@/views/android/separation/ZoneView.vue'
import BatchView from '@/views/android/separation/BatchView.vue'
import { useUserStore } from '@/stores/user'
import { verificarSessao } from '@/services/authService'
import SeparationView from '@/views/SeparationView.vue'
import ProductReceivingView from '@/views/ProductReceivingView.vue'
import StockManagementView from '@/views/StockManagementView.vue'
import InventoryView from '@/views/InventoryView.vue'
import CadUserView from '@/views/CadUserView.vue'

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
    name: 'homeWeb',
    component: HomeWebView,
    meta: { requiresAuth: true }  // ← ROTAS PROTEGIDAS
  },
  {
    path: '/homeAndroid',
    name: 'homeAndroid',
    component: HomeAndroidView,
    meta: { requiresAuth: true }  // ← ROTAS PROTEGIDAS
  },
  {
    path: '/separation',
    name: 'separation',
    component: SeparationView,
    meta: { requiresAuth: true }  // ← ROTAS PROTEGIDAS
  },
  {
    path: '/receiving',
    name: 'receiving',
    component: ProductReceivingView,
    meta: { requiresAuth: true }  // ← ROTAS PROTEGIDAS
  },
  {
    path: '/stock',
    name: 'stock',
    component: StockManagementView,
    meta: { requiresAuth: true }  // ← ROTAS PROTEGIDAS
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: InventoryView,
    meta: { requiresAuth: true }  // ← ROTAS PROTEGIDAS
  },
  {
    path: '/notFound',
    name: '404',
    component: NotFoundView
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
  },
  {
    path: '/cad_user',
    name: 'cad_user',
    component: CadUserView,
    meta: { requiresAuth: true }  // ← ROTAS PROTEGIDAS
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView
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
