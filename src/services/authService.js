import { useUserStore } from '@/stores/user'
export async function loginUser(username, password) {
    try {
      const basicAuth = btoa(`${username}:${password}`) // gera o base64
      const userStore = useUserStore()
      const apiUrl = JSON.parse(localStorage.getItem('API_URL'));
      const response = await fetch(apiUrl.API_URL+'/auth/login', {
        method: 'POST',
        credentials: 'include', // envia e recebe cookie HttpOnly
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      })
  
      if (response.ok) {
        const data = await response.json()
        if(data.status){
            userStore.setUsuario(data.data)
            return true
        }
      } else {
        const errorText = await response.text()
        console.error('Erro:', errorText)
        return false
      }
    } catch (err) {
      console.error('Erro ao autenticar:', err)
      return false
    }
  }

export async function verificarSessao() {
  try{
    const apiUrl = JSON.parse(localStorage.getItem('API_URL'));
    const res = await fetch(apiUrl.API_URL+'/auth/validate', {
        method:'POST',
        credentials: 'include'
    })
    const response = await res.json()
    return response
  }catch(err){
    return {status:false, data:null, message:"Sem resposta do servidor! - "+err.message}
  }
}

export async function logoutUser() {
  try{
    const apiUrl = JSON.parse(localStorage.getItem('API_URL'));
    const res = await fetch(apiUrl.API_URL+'/auth/logout', {
        method:'POST',
        credentials: 'include'
    })
    const response = await res.json()
    return response
  }catch(err){
    return {status:false, data:null, message:"Sem resposta do servidor! - "+err.message}
  }
}
