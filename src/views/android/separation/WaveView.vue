<!-- src/components/VoltarBtn.vue -->
<template>
    <button @click="voltar" class="voltar-btn">
      ←
    </button>
    <div class="corpo">
      <hr>
      <!-- Tarefas pendentes -->
      <div v-if="tasks && status_separacao ==='aguardando_separacao'"> 
        <h2 class="text-center">Tarefas pendentes de separação</h2>
        <article v-for="task in tasks" :key="task.id_picking" class="mt-5">
          <div class="card text-center">
            <div class="card-header">
              <strong>ID:</strong> {{ task.id_picking }}  
            </div>
            <div class="card-body">
              <h5 class="card-title">Pedidos:</h5>
              <p class="card-text">{{ getPedidosFromRef(task.reference_id).join(', ') }}</p>
              <a href="#" class="btn btn-primary" @click.prevent="iniciarSeparacao(task)">Iniciar separação</a>
            </div>
            <div class="card-footer text-body-secondary">
              <strong>Data cadastro: </strong> {{ task.createdAt }}
            </div>
          </div>
        </article>
      </div>

      <div v-if="status_separacao ==='em_separacao'" class="mt-3">
        <div class="card">
          <div class="card-header">
            <h2>Separação de Item</h2>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><strong>Pedido: </strong>{{ itemSeparacao.Order.externalId }}</li>
            <li class="list-group-item"><strong>Sku:</strong> {{ itemSeparacao.sku }}</li>
            <li class="list-group-item"><strong>Produto:</strong> {{ itemSeparacao.nome }}</li>
            <li class="list-group-item"><strong>Endereço:</strong> {{ itemSeparacao.location }}</li>
            <li class="list-group-item"><strong>Quantidade:</strong> {{ itemSeparacao.quantity }}</li>
            <li class="list-group-item"@click="alertaQuantidade"><strong>Quantidade separado:</strong> {{ itemSeparacao.qtdSeparado }}</li>
            <li class="list-group-item">
              <label>
                <strong>EAN: </strong>
                <input type="number" v-model="eanCapture" @keyup.enter="curretItem"/>
              </label>
            </li>
            <li class="list-group-item"><strong>Status separação: </strong>{{restante}} de {{ wave_picking.items.length }}</li>
            <li class="list-group-item error-msg"v-if="error">{{ error }}</li>
            <li class="list-group-item"><input class="btn btn-danger" type="button" value="Pular este produto" v-on:click="pularProduto"></li>
          </ul>
        </div>
      </div>

      <div v-if="status_separacao === 'a_finalizar'">

      </div>
    </div>
</template>
  
<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'
  import { LoadCurrentTask, LoadPendingTasks, LoadTask } from '@/utils/others'
  const status_separacao = ref('pendente')
  const tasks = ref({});
  const router = useRouter()
  const userStore = useUserStore()
  const wave_picking = ref({
  pedidos: [],
  items: []
  })
  const error = ref(null)
  const eanCapture = ref('')
  const restante = ref('')
  const itemSeparacao = ref({
  id: '',
  orderId: '',
  sku: '',
  ean: '',
  nome: '',
  quantity: 0,
  location: '',
  createdAt: '',
  updatedAt: '',
  Order: {
    id: '',
    externalId:'',
    status: ''
  },
  separado: false,
  qtdSeparado: 0,
  pendente:false
  })

  onMounted(async ()=>{
    try{
      userStore.carregarUsuario()
      tasks.value = await LoadCurrentTask('wave', userStore.usuario)
      if(tasks.value && tasks.value.length > 0){
        status_separacao.value = "em_separacao"
        const items = await LoadTask('wave', tasks.value[0].id_picking)
        const pedidos  = [...new Set(items.map(p=>p.orderId))]
        wave_picking.value = {pedidos, items}
        positionItem(wave_picking.value.items)
      }else{
        status_separacao.value = 'aguardando_separacao'
        tasks.value = await LoadPendingTasks('wave')
        console.log(tasks.value)
      }
    }catch(err){
      console.log(err.message)
    }
  })

  function getPedidosFromRef(reference_id) {
      try {
        const ref = JSON.parse(reference_id);
        return ref.orders || [];
      } catch {
        return [];
      }
    }
  
  function voltar() {
    router.back()
  }

  function alertaQuantidade(){
    if(confirm("Ao confirmar você irá setar o total de produto como separado, faça isso somente ao pegar toda a quantidade do produto!")){
      itemSeparacao.value.qtdSeparado = itemSeparacao.value.quantity
    }
  }

  async function iniciarSeparacao(data){
    try{
      const apiUrl = JSON.parse(localStorage.getItem('API_URL'))
      const response = await fetch(apiUrl.API_URL+'/update', {
        method:'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status:"em_separacao",
          data:data
        })
      })
      if(response.ok){
        const res = await response.json()
        iniciado.value = true
        localStorage.setItem('SEPARATION', JSON.stringify({status_separacao:status_separacao.value, items:wave_picking.value.items}))
      }
    }catch(err){
      console.log(err.message)
    }
  }

  function positionItem(items){
    console.log(items)
    for (let item in items){
      if(!items[item].separado && !items[item].pendente){
        itemSeparacao.value = items[item]
        restante.value = Number(item)+1
        break
      }
    }
  }

  function pularProduto(){
    if(confirm("Esta ação irá indicar o produto como pendente em estoque! Deseja continuar?")){
      itemSeparacao.value.pendente = true
    }
  }

  function curretItem(){
    if(eanCapture.value == itemSeparacao.value.ean){
      itemSeparacao.value.qtdSeparado = itemSeparacao.value.qtdSeparado < itemSeparacao.value.quantity ? itemSeparacao.value.qtdSeparado+1 : itemSeparacao.value.qtdSeparado
      if(itemSeparacao.value.qtdSeparado == itemSeparacao.value.quantity){
        itemSeparacao.value.separado = true
        localStorage.setItem('SEPARATION', JSON.stringify({status_separacao:status_separacao.value, items:wave_picking.value.items}))
        positionItem(wave_picking.value.items)
      }
    }else{
      error.value = "Produto não confere!"
      setTimeout(() =>{
        error.value = null
      }, 2000)
    }
  }
  </script>
  
  <style scoped>
  .voltar-btn {
    position: fixed;
    top: 40px;
    left: 12px;
    z-index: 1000;
    background-color: #f3f4f6; /* cinza claro */
    border: none;
    border-radius: 8px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 16px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .corpo{
    position: relative;
    top: 45px;
  }

  .iniciar{
    text-align: center;
  }

  .item-container {
  word-wrap: normal;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 12px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.item-container h2, .item-container h3{
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.info p,
.order-status p,
.timestamps p,
label {
  margin: 8px 0;
  color: #555;
}

.error-msg {
  color: red;
  margin-top: 1rem;
  text-align: center;
}

.pendente {
  display: flex;
  justify-content: center; /* centraliza horizontalmente */
  align-items: center;     /* centraliza verticalmente */
}
.pendente input{
  width: 100%;
  color: #333;
  background-color: #da5151; /* cinza claro */
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}


</style>
  