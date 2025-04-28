<template>
    <NavBarWeb :nivel_acesso = "Number(userStore.nivel_acesso)"></NavBarWeb>
    <div class="container mt-5">
      <h2 class="mb-3">Gerenciamento de Usuários</h2>
  
      <!-- Formulário -->
      <div class="card mb-4">
        <div class="card-header">{{ isEditMode ? 'Atualizar Usuário' : 'Cadastrar Novo Usuário' }}</div>
        <div class="card-body">
          <form @submit.prevent="handleSubmit">
            <div class="row g-3">
  
              <div class="col-md-6">
                <label class="form-label">Nome</label>
                <input v-model="form.nome" type="text" class="form-control" required>
              </div>
  
              <div class="col-md-6">
                <label class="form-label">Sobrenome</label>
                <input v-model="form.sobrenome" type="text" class="form-control">
              </div>
  
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input v-model="form.email" type="email" class="form-control">
              </div>
  
              <div class="col-md-3">
                <label class="form-label">Telefone 1</label>
                <input v-model="form.telefone1" type="text" class="form-control">
              </div>
  
              <div class="col-md-3">
                <label class="form-label">Telefone 2</label>
                <input v-model="form.telefone2" type="text" class="form-control">
              </div>
  
              <div class="col-md-6">
                <label class="form-label">Documento</label>
                <input v-model="form.documento" type="text" class="form-control" required>
              </div>
  
              <div class="col-md-6">
                <label class="form-label">Tipo de Documento</label>
                <select v-model="form.tipo_documento" class="form-select" required>
                  <option value="">Selecione...</option>
                  <option value="RG">RG</option>
                  <option value="CPF">CPF</option>
                  <option value="HABILITACAO">Habilitação</option>
                  <option value="TITULO_ELEITOR">Título de Eleitor</option>
                </select>
              </div>
  
              <div class="col-md-4">
                <label class="form-label">Usuário</label>
                <input v-model="form.usuario" type="text" class="form-control" required>
              </div>
  
              <div class="col-md-4" v-if="!isEditMode">
                <label class="form-label">Senha</label>
                <input v-model="form.senha" type="password" class="form-control" required>
              </div>
  
              <div class="col-md-4">
                <label class="form-label">Setor</label>
                <input v-model="form.setor" type="text" class="form-control" required>
              </div>
  
              <div class="col-md-4">
                <label class="form-label">Nível de Acesso</label>
                <select v-model="form.nivel_acesso" class="form-select" required>
                  <option value="1">1 - Operador</option>
                  <option value="2">2 - Conferente</option>
                  <option value="3">3 - Estoquista</option>
                  <option value="4">4 - Fiscal</option>
                  <option value="5">5 - Admin</option>
                </select>
              </div>
  
              <div class="col-md-4">
                <label class="form-label">Status</label>
                <select v-model="form.ativo" class="form-select" required>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
  
            </div>
  
            <div class="mt-3 d-flex gap-2">
              <button type="submit" class="btn btn-success">{{ isEditMode ? 'Atualizar' : 'Cadastrar' }}</button>
              <button v-if="isEditMode" type="button" class="btn btn-secondary" @click="resetForm">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Tabela -->
      <div class="card">
        <div class="card-header">Usuários Cadastrados</div>
        <div class="card-body table-responsive">
          <table class="table table-hover table-bordered rounded">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Setor</th>
                <th>Nível</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in usuarios" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.nome }} {{ user.sobrenome }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.telefone1 }}</td>
                <td>{{ user.setor }}</td>
                <td>{{ user.nivel_acesso }}</td>
                <td>{{ user.ativo }}</td>
                <td>
                  <button class="btn btn-sm btn-primary" @click="editarUsuario(user)">Editar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
    </div>
  </template>
  
  <script setup>
  import NavBarWeb from '@/components/NavBarWeb.vue'
  import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { verificarSessao } from '@/services/authService'
const router = useRouter()
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
  
  const usuarios = ref([
    {
      id: 1, nome: "João", sobrenome: "Silva", email: "joao@email.com", telefone1: "11999999999",
      setor: "Logística", nivel_acesso: "3", ativo: "Ativo"
    },
    {
      id: 2, nome: "Maria", sobrenome: "Oliveira", email: "maria@email.com", telefone1: "11988888888",
      setor: "Fiscal", nivel_acesso: "4", ativo: "Inativo"
    }
  ])
  
  const isEditMode = ref(false)
  const form = ref({
    id: null,
    nome: "",
    sobrenome: "",
    email: "",
    telefone1: "",
    telefone2: "",
    documento: "",
    tipo_documento: "",
    usuario: "",
    senha: "",
    setor: "",
    nivel_acesso: "1",
    ativo: "Ativo",
  })
  
  function resetForm() {
    form.value = {
      id: null,
      nome: "",
      sobrenome: "",
      email: "",
      telefone1: "",
      telefone2: "",
      documento: "",
      tipo_documento: "",
      usuario: "",
      senha: "",
      setor: "",
      nivel_acesso: "1",
      ativo: "Ativo",
    }
    isEditMode.value = false
  }
  
  function handleSubmit() {
    if (isEditMode.value) {
      const index = usuarios.value.findIndex(u => u.id === form.value.id)
      if (index !== -1) {
        usuarios.value[index] = { ...form.value }
      }
    } else {
      form.value.id = Date.now()
      usuarios.value.push({ ...form.value })
    }
    resetForm()
  }
  
  function editarUsuario(user) {
    isEditMode.value = true
    form.value = { ...user, senha: "" }
  }
  </script>
  
  <style scoped>
  .table {
    border-radius: 0.5rem;
    overflow: hidden;
  }
  </style>
  