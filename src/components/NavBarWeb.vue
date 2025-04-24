<template>
  <div v-if="is_Web">
    <nav class="navbar navbar-expand-lg navbar-custom px-3">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">SyncColetor</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">

            <li class="nav-item" v-if="nivel_acesso >= 1">
              <a class="nav-link" href="#" @click.prevent="navigateToSeparation('/separation')">Separação de Pedidos</a>
            </li>

            <li class="nav-item" v-if="nivel_acesso >= 3">
              <a class="nav-link" href="#" @click.prevent="navigateToStockManagement">Gerenciamento de Estoque</a>
            </li>

            <li class="nav-item" v-if="nivel_acesso >= 1">
              <a class="nav-link" href="#" @click.prevent="navigateToProductReceiving">Recebimento de Produtos</a>
            </li>

            <li class="nav-item" v-if="nivel_acesso >= 3">
              <a class="nav-link" href="#" @click.prevent="navigateToInventory">Inventário</a>
            </li>

            <li class="nav-item" v-if="nivel_acesso >= 5">
              <a class="nav-link" href="#" @click.prevent="navigateToCadUser">Cadastro de Usuários</a>
            </li>

            <li class="nav-item" v-if="nivel_acesso >= 5">
              <a class="nav-link" href="#" @click.prevent="navigateConfig">Configurações</a>
            </li>

          </ul>

          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link text-danger" href="#" @click.prevent="logout">Logout</a>
            </li>
          </ul>

        </div>
      </div>
    </nav>
  </div>

  <div v-if="is_Android"> 
    <nav class="navbar navbar-expand-lg navbar-light bg-light px-3">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Menu</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navTypeDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
              Separação de Pedidos
              </a>
              <ul class="dropdown-menu" aria-labelledby="navTypeDropdown">
                <li><a class="dropdown-item" href="#" @click.prevent="navigateToSeparation('/wave')">Por Onda</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="navigateToSeparation('/zone')">Por Zona</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="navigateToSeparation('/batch')">Por Lote</a></li>
              </ul>
            </li>

            <li class="nav-item" v-if="userStore.nivel_acesso >= 3">
              <a class="nav-link" href="#" @click.prevent="navigateToStockManagement">Gerenciamento de Estoque</a>
            </li>

            <li class="nav-item" v-if="userStore.nivel_acesso >= 1">
              <a class="nav-link" href="#" @click.prevent="navigateToProductReceiving">Recebimento de Produtos</a>
            </li>

            <li class="nav-item" v-if="userStore.nivel_acesso >= 3">
              <a class="nav-link" href="#" @click.prevent="navigateToInventory">Inventário</a>
            </li>

            <li class="nav-item" v-if="userStore.nivel_acesso >= 5">
              <a class="nav-link" href="#" @click.prevent="navigateToCadUser">Cadastro de Usuários</a>
            </li>

            <li class="nav-item" v-if="userStore.nivel_acesso >= 5">
              <a class="nav-link" href="#" @click.prevent="navigateConfig">Configurações</a>
            </li>

          </ul>

          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link text-danger" href="#" @click.prevent="logout">Logout</a>
            </li>
          </ul>

        </div>
      </div>
    </nav>
  </div>

  
</template>

<script setup>
import { useRouter } from 'vue-router'
import { logoutUser } from '@/services/authService'
import { useUserStore } from '@/stores/user' // se precisar do store
import { isAndroid, isWeb } from '@/utils/platform';

const is_Android = isAndroid()
const is_Web = isWeb()
const router = useRouter()
const userStore = useUserStore()

const props = defineProps({
  nivel_acesso: {
    type: Number,
    required: true,
  }
})

function navigateToSeparation(type) {
    router.push(type)
}

function navigateToStockManagement() {
  router.push('/stock')
}

function navigateToInventory() {
  router.push('/inventory')
}

function navigateToProductReceiving() {
  router.push('/receiving')
}

function navigateToCadUser() {
  router.push('/cad_user')
}

function navigateConfig() {
  router.push('/config')
}

async function logout() {
  await logoutUser()
  userStore.logout()
  router.push('/login')
}
</script>


<style scoped>
  .navbar-custom {
  background: linear-gradient(to right, #0f2027, #203a43, #2c5364);
  }

  .navbar-custom .nav-link,
  .navbar-custom .navbar-brand,
  .navbar-custom .dropdown-toggle {
    color: #f1f1f1;
  }

  .navbar-custom .nav-link:hover,
  .navbar-custom .dropdown-item:hover {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.1);
  }

  .navbar-custom .dropdown-menu {
    background-color: #203a43;
    border: none;
  }

  .navbar-custom .dropdown-item {
    color: #e0e0e0;
  }

</style>