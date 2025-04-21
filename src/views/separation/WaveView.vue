<!-- src/components/VoltarBtn.vue -->
<template>
    <button @click="voltar" class="voltar-btn">
      ←
    </button>
    <div class="corpo">
      <hr>
        <div v-if="!iniciado" class="iniciar">
          <b>Separação por Onda</b><br>
          <p>{{wave_picking.pedidos.length}} pedidos aguardando separação, com {{ wave_picking.items.length }} itens no total.</p>
          <button @click="iniciarSeparacao(wave_picking.items)">Iniciar separação</button>   
        </div>
      <div v-if="!iniciado" class="item-container separation-card">
        <h2>Separação de Item</h2>

        <div class="info">
          <h3>Pedido: {{ itemSeparacao.Order.externalId }}</h3>
          <p><strong>Sku:</strong> {{ itemSeparacao.sku }}</p>
          <p><strong>Produto:</strong> {{ itemSeparacao.nome }}</p>
          <p><strong>Endereço:</strong> {{ itemSeparacao.location }}</p>
          <p><strong>Quantidade:</strong> {{ itemSeparacao.quantity }}</p>
          <p @click="alertaQuantidade"><strong>Quantidade separado:</strong> {{ itemSeparacao.qtdSeparado }}</p>
          <label>
            <strong>EAN: </strong>
            <input type="number" v-model="eanCapture" @keyup.enter="curretItem"/>
          </label>
        </div>

        <div class="order-status">
          <br>
          <p><strong>Status separação: </strong>{{restante}} de {{ wave_picking.items.length }}</p>
        </div>
        <div class="pendente">
          <input type="button" value="Pular este produto" v-on:click="pularProduto">
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
      </div>
      <div v-if="finalizacao">

      </div>
    </div>
</template>
  
<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  const router = useRouter()
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
  const finalizacao = ref(null)
  const iniciado = ref(false)

  onMounted(async ()=>{
    try{
      const statusSeparation = JSON.parse(localStorage.getItem('SEPARATION'))
      if(statusSeparation){
        iniciado.value = statusSeparation.iniciado
        const pedidos  = [...new Set(statusSeparation.items.map(p=>p.orderId))]
        wave_picking.value = {pedidos, items:statusSeparation.items}
        positionItem(wave_picking.value.items)
      }else{
        const apiUrl = JSON.parse(localStorage.getItem('API_URL'))
        const response = await fetch(apiUrl.API_URL+'/order_picking?type=wave', {
          method:'GET',
          credentials: 'include'
        })
        if(response.ok){
          const data = await response.json()
          const qtdOrders  = [...new Set(data.data.map(p=>p.orderId))]
          const items = data.data.map(item => ({
            ...item,
            separado:false,
            qtdSeparado:0,
            pendente:false
          }))
          positionItem(items)
          wave_picking.value = {pedidos:qtdOrders, items}
        }
      }
    }catch(err){
      console.log(err.message)
    }
  })
  
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
        localStorage.setItem('SEPARATION', JSON.stringify({iniciado:iniciado.value, items:wave_picking.value.items}))
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
        localStorage.setItem('SEPARATION', JSON.stringify({iniciado:iniciado.value, items:wave_picking.value.items}))
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
    top: 12px;
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
  