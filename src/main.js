import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const pinia = createPinia()
fetch('/config.json')
  .then(res => res.json())
  .then(config => {
    localStorage.setItem('API_URL', JSON.stringify(config));
});
createApp(App).use(router).use(pinia).mount('#app')

// Carrega usuário salvo
import { useUserStore } from './stores/user'
useUserStore().carregarUsuario()