<script>
import NavBarWeb from '@/components/NavBarWeb.vue'
</script>
<template>
  <NavBarWeb :nivel_acesso = "Number(userStore.nivel_acesso)"></NavBarWeb>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { verificarSessao } from '@/services/authService'


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

</script>

