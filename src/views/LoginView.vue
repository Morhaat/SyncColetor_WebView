<template>
    <div class="login-container">
      <div class="login-card">
        <p v-if="statusApi" class="api-msg">{{ statusApi }}</p>
        <img src="../assets/synccoletor_logo.png" alt="Logo SyncColetor" class="logo" />
        <h1>Login</h1>
        <form @submit.prevent="login">
          <input v-model="username" placeholder="Usuário" />
          <input v-model="password" type="password" placeholder="Senha" />
          <button type="submit">Entrar</button>
        </form>
        <p v-if="error" class="error-msg">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { loginUser, verificarSessao } from '@/services/authService'
  import { useUserStore } from '@/stores/user'
  import MD5 from 'crypto-js/md5'
  
  const router = useRouter()
  const username = ref('')
  const password = ref('')
  const error = ref(null)
  const statusApi = ref('')

  const userStore = useUserStore()

  onMounted(async () => {
    try{
      const apiUrl = JSON.parse(localStorage.getItem('API_URL'));
      const response = await fetch(apiUrl.API_URL+'/health', {
        method: 'GET'
      })
      if(response.ok){
        const health = await response.json()
        statusApi.value = health.status
      }

      userStore.carregarUsuario()
      const valido = await verificarSessao()
      //console.log(valido)
      if(valido.status){
        if(!userStore.nome){
          userStore.setUsuario(valido.data)
        }
        router.push('/home')
      }else{
          router.push('/login')
      }

    } catch (e) {
      console.log(e)
      error.value = 'Erro ao conectar'
    }
  })
  
  async function login() {
    error.value = null
    try {
        const pass = MD5(password.value).toString();
      const success = await loginUser(username.value, pass)
      if (success) {
        router.push('/home')
      } else {
        error.value = 'Usuário ou senha inválidos'
      }
    } catch (e) {
      error.value = 'Erro ao conectar'
    }
  }
  </script>
  

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.logo {
  width: 100px;
  margin: 0 auto 1rem auto;
  display: block;
}
.login-container {
  display: flex;
  height: 100dvh; /* dvh = altura real da viewport (suporte moderno) */
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #0f2027, #203a43, #2c5364);
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.login-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-card h1 {
  margin-bottom: 1.5rem;
  color: #2c5364;
}

.login-card form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-card input {
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.login-card input:focus {
  border-color: #2c5364;
  outline: none;
}

.login-card button {
  background-color: #2c5364;
  color: #fff;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-card button:hover {
  background-color: #1a3d4f;
}

.error-msg {
  color: red;
  margin-top: 1rem;
}
.api-msg {
  color: #2c5364;
  margin-top: 1rem;
}
</style>
