<template>
    <NavBarWeb :nivel_acesso = "Number(userStore.nivel_acesso)"></NavBarWeb>
    <div class="container py-4 mt-5">
      <h2 class="mb-4 text-center">Gerenciamento de Inventários</h2>
  
      <!-- Inventário em andamento -->
      <div class="card mb-4 shadow-sm rounded" v-if="inventarioAtual">
        <div class="card-header bg-warning text-dark">
          <strong>Inventário em Andamento</strong>
        </div>
        <div class="card-body">
          <p><strong>ID:</strong> {{ inventarioAtual.id }}</p>
          <p><strong>Responsável:</strong> {{ inventarioAtual.responsavel }}</p>
          <p><strong>Início:</strong> {{ inventarioAtual.inicio }}</p>
          <p><strong>Tipo:</strong> {{ inventarioAtual.tipo }}</p>
          <p><strong>Participantes:</strong> {{ inventarioAtual.participantes.join(', ') }}</p>
  
          <div class="text-end">
            <button class="btn btn-success btn-sm" @click="finalizarInventario">Finalizar Inventário</button>
          </div>
        </div>
      </div>
      
      <!-- Inventários Agendados -->
      <div class="card mb-4 shadow-sm rounded">
        <div class="card-header bg-info text-white">
          <strong>Inventários Agendados</strong>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-hover table-bordered rounded">
                    <thead class="table-info">
                    <tr>
                        <th>#</th>
                        <th>Data Agendada</th>
                        <th>Responsável</th>
                        <th>Tipo</th>
                        <th>Ação</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(inv, index) in inventariosAgendados" :key="index">
                        <td>{{ inv.id }}</td>
                        <td>{{ inv.data }}</td>
                        <td>{{ inv.responsavel }}</td>
                        <td>{{ inv.tipo }}</td>
                        <td>
                        <button class="btn btn-sm btn-primary" @click="iniciarInventario(inv)">Iniciar</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
      </div>
  
      <!-- Inventários Passados -->
      <div class="card shadow-sm rounded">
        <div class="card-header bg-secondary text-white">
          <strong>Inventários Concluídos</strong>
        </div>
        <div class="card-body table-responsive">
          <table class="table table-hover table-bordered rounded">
            <thead class="table-secondary">
              <tr>
                <th>#</th>
                <th>Data</th>
                <th>Responsável</th>
                <th>Status</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(inv, index) in inventariosConcluidos" :key="index">
                <td>{{ inv.id }}</td>
                <td>{{ inv.data }}</td>
                <td>{{ inv.responsavel }}</td>
                <td>
                  <span :class="{
                    'text-success': inv.status === 'Concluído',
                    'text-danger': inv.status === 'Divergência',
                    'text-warning': inv.status === 'Parcial'
                  }">
                    {{ inv.status }}
                  </span>
                </td>
                <td>{{ inv.observacoes }}</td>
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
  const inventariosAgendados = ref([
    { id: 1, data: '2025-04-28', responsavel: 'Carlos Silva', tipo: 'Total' },
    { id: 2, data: '2025-05-05', responsavel: 'Amanda Rocha', tipo: 'Parcial' },
  ])
  
  const inventarioAtual = ref(null)
  
  const inventariosConcluidos = ref([
    { id: 10, data: '2025-03-15', responsavel: 'João Mendes', status: 'Concluído', observacoes: 'Sem divergências' },
    { id: 11, data: '2025-02-12', responsavel: 'Luana Souza', status: 'Divergência', observacoes: 'Faltaram 3 itens no endereço C2' },
    { id: 12, data: '2025-01-20', responsavel: 'Paulo Costa', status: 'Concluído', observacoes: 'Tudo correto' },
  ])
  
  function iniciarInventario(inventario) {
    inventarioAtual.value = {
      ...inventario,
      inicio: new Date().toLocaleString(),
      participantes: ['Carlos Silva', 'João Lima'],
    }
    inventariosAgendados.value = inventariosAgendados.value.filter(i => i.id !== inventario.id)
  }
  
  function finalizarInventario() {
    const concluido = {
      id: inventarioAtual.value.id,
      data: new Date().toLocaleDateString(),
      responsavel: inventarioAtual.value.responsavel,
      status: 'Concluído',
      observacoes: 'Finalizado com sucesso'
    }
    inventariosConcluidos.value.unshift(concluido)
    inventarioAtual.value = null
  }
  </script>
  
  <style scoped>
  .card {
    border-radius: 1rem;
  }
  .table {
    border-radius: 0.5rem;
    overflow: hidden;
  }
  </style>
  