<template>
    <NavBarWeb :nivel_acesso = "Number(userStore.nivel_acesso)"></NavBarWeb>
    <div class="container py-4">
      <h2 class="mb-4 text-center">Gerenciamento de Endereçamento de Estoque</h2>
  
      <!-- Movimentação -->
      <div class="card mb-4 shadow-sm rounded">
        <div class="card-header bg-dark text-white">
          <strong>Movimentar Produto</strong>
        </div>
        <div class="card-body">
          <form @submit.prevent="moverProduto">
            <div class="row g-3">
              <div class="col-md-4">
                <label for="codigo" class="form-label">Código do Produto</label>
                <input v-model="movimentacao.codigo" type="text" class="form-control" required>
              </div>
              <div class="col-md-4">
                <label for="de" class="form-label">Endereço Atual</label>
                <input v-model="movimentacao.de" type="text" class="form-control" required>
              </div>
              <div class="col-md-4">
                <label for="para" class="form-label">Novo Endereço</label>
                <input v-model="movimentacao.para" type="text" class="form-control" required>
              </div>
            </div>
            <div class="mt-3 text-end">
              <button class="btn btn-primary" type="submit">Mover</button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Consulta -->
      <div class="card mb-4 shadow-sm rounded">
        <div class="card-header bg-secondary text-white">
          <strong>Consulta de Produto</strong>
        </div>
        <div class="card-body">
          <form @submit.prevent="consultarProduto">
            <div class="row g-3 align-items-end">
              <div class="col-md-6">
                <label class="form-label">Código do Produto</label>
                <input v-model="codigoConsulta" type="text" class="form-control" required>
              </div>
              <div class="col-md-6 text-end">
                <button class="btn btn-outline-secondary" type="submit">Consultar</button>
              </div>
            </div>
          </form>
  
          <div v-if="produtoConsulta" class="mt-3">
            <h5>Informações:</h5>
            <ul class="list-group">
              <li class="list-group-item">Código: {{ produtoConsulta.codigo }}</li>
              <li class="list-group-item">Endereço: {{ produtoConsulta.endereco }}</li>
              <li class="list-group-item">Validade: {{ produtoConsulta.validade }}</li>
              <li class="list-group-item">Quantidade: {{ produtoConsulta.quantidade }}</li>
            </ul>
          </div>
        </div>
      </div>
  
      <!-- Produtos Internados -->
      <div class="card shadow-sm rounded">
        <div class="card-header bg-success text-white">
          <strong>Ultimos Produtos Internados</strong>
        </div>
        <div class="card-body table-responsive">
          <table class="table table-hover table-bordered rounded">
            <thead class="table-success">
              <tr>
                <th>Código</th>
                <th>Endereço</th>
                <th>Validade</th>
                <th>Quantidade</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(produto, index) in produtosInternados" :key="index">
                <td>{{ produto.codigo }}</td>
                <td>{{ produto.endereco }}</td>
                <td>{{ produto.validade }}</td>
                <td>{{ produto.quantidade }}</td>
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
  const movimentacao = ref({
    codigo: '',
    de: '',
    para: ''
  })
  
  const codigoConsulta = ref('')
  const produtoConsulta = ref(null)
  
  const produtosInternados = ref([
    { codigo: 'PROD001', endereco: 'A01', validade: '2025-06-10', quantidade: 15 },
    { codigo: 'PROD002', endereco: 'B02', validade: '2025-05-01', quantidade: 10 },
    { codigo: 'PROD003', endereco: 'C03', validade: '2025-12-15', quantidade: 30 },
  ])
  
  function moverProduto() {
    const { codigo, de, para } = movimentacao.value
    const produto = produtosInternados.value.find(p => p.codigo === codigo && p.endereco === de)
    if (produto) {
      produto.endereco = para
      alert(`Produto ${codigo} movido de ${de} para ${para}`)
    } else {
      alert('Produto não encontrado nesse endereço.')
    }
    movimentacao.value = { codigo: '', de: '', para: '' }
  }
  
  function consultarProduto() {
    const produto = produtosInternados.value.find(p => p.codigo === codigoConsulta.value)
    produtoConsulta.value = produto || null
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
  