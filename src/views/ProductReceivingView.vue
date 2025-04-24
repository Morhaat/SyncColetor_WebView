<template>
    <NavBarWeb :nivel_acesso = "Number(userStore.nivel_acesso)"></NavBarWeb>
    <div class="container my-4 geral">
      <h1 class="text-center mb-4">Recebimento de Mercadorias</h1>
  
      <!-- Aguardando Recebimento -->
      <section>
        <h4 class="text-warning">Aguardando Recebimento</h4>
        <div class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Nota Fiscal</th>
                <th>Fornecedor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="nota in aguardando" :key="nota.id">
                <td>{{ nota.id }}</td>
                <td>{{ nota.nf }}</td>
                <td>{{ nota.fornecedor }}</td>
                <td class="text-warning fw-bold">Aguardando Recebimento</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
  
      <!-- Em Recebimento -->
      <section class="mt-5">
        <h4 class="text-primary">Em Recebimento</h4>
        <div class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Nota Fiscal</th>
                <th>Responsável</th>
                <th>Início</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="nota in emRecebimento" :key="nota.id">
                <td>{{ nota.id }}</td>
                <td>{{ nota.nf }}</td>
                <td>{{ nota.usuario }}</td>
                <td>{{ nota.inicio }}</td>
                <td class="text-primary fw-bold">Em Recebimento</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
  
      <!-- Recebido -->
      <section class="mt-5">
        <h4 class="text-success">Recebido</h4>
        <div class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Nota Fiscal</th>
                <th>Recebido por</th>
                <th>Data</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="nota in recebidas" :key="nota.id">
                <td>{{ nota.id }}</td>
                <td>{{ nota.nf }}</td>
                <td>{{ nota.usuario }}</td>
                <td>{{ nota.data }}</td>
                <td :class="{
                  'text-success fw-bold': nota.status === 'OK',
                  'text-danger fw-bold': nota.status === 'Pendência'
                }">
                  {{ nota.status }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
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

  const aguardando = [
    { id: 1, nf: 'NF123456', fornecedor: 'Fornecedor A' },
    { id: 2, nf: 'NF123457', fornecedor: 'Fornecedor B' },
    { id: 3, nf: 'NF123458', fornecedor: 'Fornecedor C' },
  ]
  
  const emRecebimento = [
    { id: 4, nf: 'NF123459', usuario: 'João', inicio: '2025-04-23 10:15' },
    { id: 5, nf: 'NF123460', usuario: 'Maria', inicio: '2025-04-23 11:05' },
  ]
  
  const recebidas = [
    { id: 6, nf: 'NF123461', usuario: 'Carlos', data: '2025-04-22 14:20', status: 'OK' },
    { id: 7, nf: 'NF123462', usuario: 'Ana', data: '2025-04-22 15:00', status: 'OK' },
    { id: 8, nf: 'NF123463', usuario: 'João', data: '2025-04-22 16:45', status: 'Pendência' },
    { id: 9, nf: 'NF123464', usuario: 'Maria', data: '2025-04-22 17:10', status: 'Pendência' },
  ]
  </script>
  
  <style scoped>
  .table {
    font-size: 0.95rem;
  }
  </style>
  