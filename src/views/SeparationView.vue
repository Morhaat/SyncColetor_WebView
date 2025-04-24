<template>
    <NavBarWeb :nivel_acesso = "Number(userStore.nivel_acesso)"></NavBarWeb>
    <div class="container py-4 geral">
      <div class="card shadow-sm">
        <div class="card-section">
          <h5 class="m-0">Gerenciamento de Tarefas de Picking</h5>
        </div>
        <div class="card-body">
  
          <!-- Aguardando Separação -->
          <h6 class="table-title text-warning">Aguardando Separação</h6>
          <div class="table-responsive">
            <table class="table table-bordered table-sm text-center align-middle">
              <thead class="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Pedidos</th>
                  <th>Status</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in aguardandoSeparacao" :key="index">
                  <td>{{ item.id }}</td>
                  <td>{{ item.pedidos }}</td>
                  <td class="status-aguardando">Aguardando Separação</td>
                  <td>{{ item.tipo }}</td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <!-- Em Separação -->
          <h6 class="table-title text-primary mt-4">Em Separação</h6>
          <div class="table-responsive">
            <table class="table table-bordered table-sm text-center align-middle">
              <thead class="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Pedidos</th>
                  <th>Status</th>
                  <th>Responsável</th>
                  <th>Início</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in emSeparacao" :key="index">
                  <td>{{ item.id }}</td>
                  <td>{{ item.pedidos }}</td>
                  <td class="status-em">Em Separação</td>
                  <td>{{ item.responsavel }}</td>
                  <td>{{ item.inicio }}</td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <!-- Separado -->
          <h6 class="table-title text-success mt-4">Separado</h6>
          <div class="table-responsive">
            <table class="table table-bordered table-sm text-center align-middle">
              <thead class="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Pedidos</th>
                  <th>Status</th>
                  <th>Responsável</th>
                  <th>Início</th>
                  <th>Fim</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in separado" :key="index">
                  <td>{{ item.id }}</td>
                  <td>{{ item.pedidos }}</td>
                  <td class="status-finalizado">Separado</td>
                  <td>{{ item.responsavel }}</td>
                  <td>{{ item.inicio }}</td>
                  <td>{{ item.fim }}</td>
                </tr>
              </tbody>
            </table>
          </div>
  
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'
  import { verificarSessao } from '@/services/authService'
  import NavBarWeb from '@/components/NavBarWeb.vue'
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
  function voltar() {
    router.back()
  }
  const aguardandoSeparacao = [
    { id: 1, pedidos: 'PED0006, PED0007, PED0008', tipo: 'Wave' },
    { id: 2, pedidos: 'PED0010, PED0012', tipo: 'Wave' },
    { id: 3, pedidos: 'PED0013', tipo: 'Wave' },
  ]
  
  const emSeparacao = [
    { id: 4, pedidos: 'PED0015, PED0016', responsavel: 'João', inicio: '2025-04-08 08:00' },
    { id: 5, pedidos: 'PED0017', responsavel: 'Maria', inicio: '2025-04-09 09:30' },
  ]
  
  const separado = [
    { id: 6, pedidos: 'PED0018', responsavel: 'Lucas', inicio: '2025-04-10 10:00', fim: '2025-04-10 10:30' },
    { id: 7, pedidos: 'PED0019, PED0020', responsavel: 'Carlos', inicio: '2025-04-11 14:00', fim: '2025-04-11 14:50' },
  ]
  </script>
  
  <style scoped>
  .card-section {
    background: linear-gradient(to right, #0f2027, #203a43, #2c5364);
    color: white;
    border-radius: 10px 10px 0 0;
    padding: 1rem;
  }
  .table-title {
    padding: 0.5rem 0;
    font-weight: bold;
  }
  .status-aguardando {
    color: orange;
    font-weight: 600;
  }
  .status-em {
    color: dodgerblue;
    font-weight: 600;
  }
  .status-finalizado {
    color: green;
    font-weight: 600;
  }
  </style>
  