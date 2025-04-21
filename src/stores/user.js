import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    nome: null,
    sobrenome: null,
    setor: null,
    nivel_acesso: null,
  }),
  actions: {
    setUsuario(dados) {
      this.nome = dados.nome
      this.sobrenome = dados.sobrenome
      this.setor = dados.setor
      this.nivel_acesso = dados.nivel_acesso

      localStorage.setItem('usuario', JSON.stringify(dados))
    },
    carregarUsuario() {
      const dados = localStorage.getItem('usuario')
      if (dados) {
        const obj = JSON.parse(dados)
        this.nome = obj.nome
        this.sobrenome = obj.sobrenome
        this.setor = obj.setor
        this.nivel_acesso = obj.nivel_acesso
      }
    },
    logout() {
      this.nome = null
      this.sobrenome = null
      this.setor = null
      this.nivel_acesso = null
      localStorage.removeItem('usuario')
    }
  }
})
