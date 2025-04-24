<template>
  <div class="container">
    <h1>Menu Principal</h1>

    <div class="buttons">
      <button v-if="userStore.nivel_acesso == 1" @click="navigateToSeparation()">Separação de Pedidos</button>
      <div v-if="navType">
        <button class="navType" @click="navigateToSeparation('/wave')"  >Por Onda</button>
        <button class="navType" @click="navigateToSeparation('/zone')"  >Por Zona</button>
        <button class="navType" @click="navigateToSeparation('/batch')"  >Por Lote</button>
      </div>
      <button v-if="userStore.nivel_acesso == 3" @click="navigateToStockManagement">Gerenciamento de Estoque</button>
      <button v-if="userStore.nivel_acesso == 1" @click="navigateToProductReceiving">Recebimento de Produtos</button>
      <button v-if="userStore.nivel_acesso == 3" @click="">Inventário</button>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { loginUser, logoutUser, verificarSessao } from '@/services/authService'

const router = useRouter()
const error = ref(null)
const navType = ref(false)

const userStore = useUserStore()

onMounted(async () => {
  userStore.carregarUsuario()
  if(userStore.usuario){
    const valido = await verificarSessao()
    if(!valido){
        router.push('/login')
    }
  }
})

async function logout(){
    const valido = await logoutUser()
    userStore.logout()
    router.push('/login')
}

function navigateToSeparation(type) {
  if(!type){
    navType.value = !navType.value;
  }else{
    router.push(type);
  }
}
function navigateToStockManagement() {
  router.push('/stock-management');
}
function navigateToProductReceiving() {
  router.push('/product-receiving');
}
</script>

<style scoped>
.container {
  padding: 20px;
  text-align: center;
}

.buttons {
  margin-top: 20px;
}

button {
  width: 90%;
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 1px, solid;
}

.navType{
  width: 60%;
}
</style>