<!-- src/components/VoltarBtn.vue -->
<template>
  <button @click="voltar" class="voltar-btn">
    ←
  </button>
  <div class="corpo pt-5">
    <hr>
    <!-- Tarefas pendentes -->
    <div v-if="tasks && status_separacao === 'aguardando_separacao'">
      <h2 class="text-center">Tarefas pendentes de separação</h2>
      <article v-for="task in tasks" :key="task.id_picking" class="mt-5">
        <div v-if="task.status == 'aguardando_separacao'" class="card text-center">
          <div class="card-header">
            <strong>ID:</strong> {{ task.id_picking }}
          </div>
          <div class="card-body">
            <p>{{ getPedidosFromRef(task.reference_id).length }} Pedidos</p>
            <h5 class="card-title">Pedidos:</h5>
            <p class="card-text">{{ getPedidosFromRef(task.reference_id).join(', ') }}</p>
            <a href="#" class="btn btn-primary" @click.prevent="iniciarSeparacao(task.id_picking)">Iniciar separação</a>
          </div>
          <div class="card-footer text-body-secondary">
            <strong>Data cadastro: </strong> {{ task.createdAt }}
          </div>
        </div>
      </article>
    </div>

    <div v-if="status_separacao === 'em_separacao'" class="mt-5">
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
          <li class="list-group-item" @click="alertaQuantidade"><strong>Quantidade separado:</strong> {{
            itemSeparacao.qtdSeparado || 0 }}</li>
          <li class="list-group-item">
            <label class="row">
              <input v-if="status_separacao === 'em_separacao'" ref="inputRef" v-model="eanCapture" @blur="reativarFoco"
                class="border p-2 col-12" type="text" placeholder="Código de barras do produto"
                @keydown.enter="curretItem" />
            </label>
          </li>
          <li class="list-group-item error-msg" v-if="error">{{ error }}</li>
          <li class="list-group-item"><strong>Status separação: </strong>{{ restante }} de {{ wave_picking.items.length
          }}
          </li>
          <li class="list-group-item "><input class="btn btn-danger col-12" type="button" value="Pular este produto"
              v-on:click="pularProduto"></li>
        </ul>
      </div>
    </div>

    <div v-if="status_separacao === 'finalizacao'">
      <div v-if="emiteAlerta" class="d-flex justify-content-center pt-5">
        <div class="card p-5">
          <p class="">Você separou todos os produtos desta tarefa, diriga-se para o local de finalização, clique no
            botão abaixo quando estiver pronto. </p>
          <input type="button" class="btn btn-outline-primary" value="Iniciar Finalização"
            @click="separaPedidos(wave_picking)" />
          <input type="button" class="btn btn-outline-danger mt-3" value="Cancelar Separacao"
            @click="cancelaSeparacao(tasks)" />
        </div>
      </div>

      <div v-if="pedidosSeparados">
        <div class="card">
          <div class="card-header">
            <h2 class="text-center">Finalizando Separação</h2>
          </div>
          <div v-for="(order, index) in pedidosSeparados" :key="pedidosSeparados.externalId">
            <div v-if="!order.alocado">
              <p class="text-center"><strong>Pedido: </strong>{{ order.externalId }}</p>
              <div class="text-center">
                Identificação do Armário
                <input :ref="el => inputArmario[order.externalId] = el" v-model="order.armario"
                  class="border p-2 col-12 text-center" type="text" placeholder="código do armário"
                  @keydown.enter="checaArmario(order.externalId)" />
                Identificação da baia
                <div v-if="order.confirma_baia == 'consulta'" class="spinner-border text-warning" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div v-if="order.confirma_baia == 'registro'" class="spinner-border text-success" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <input :ref="el => inputBaia[order.externalId] = el" v-model="order.baia"
                  class="border p-2 col-12 text-center" type="text" placeholder="código da baia"
                  @keydown.enter="checaBaia(order.externalId)" />
              </div>
              <ul class="list-group list-group-flush" v-for="(item, itemIndex) in order.items" :key="order.items.sku">
                <li class="list-group-item error-msg" v-if="error">{{ error }}</li>
                <li class="list-group-item"><strong>Sku:</strong> {{ item.sku }}</li>
                <li class="list-group-item"><strong>Produto:</strong> {{ item.nome }}</li>
                <li class="list-group-item"><strong>Endereço:</strong> {{ item.location }}</li>
                <li class="list-group-item"><strong>Quantidade:</strong> {{ item.quantity }}</li>
                <li class="list-group-item" @click="alertaQuantidadeAlocacao(item)"><strong>Quantidade
                    alocada:</strong>
                  {{
                    item.qtdAlocado }}</li>
                <li class="list-group-item">
                  <label v-if="!item.itemAlocado" class="row">
                    <input v-model="eanProdAlocacao[itemIndex]" class="border p-2 col-12" type="text"
                      placeholder="Código de barras do produto"
                      @keydown.enter="currentAlocate(itemIndex, item, order)" />
                  </label>
                  <p v-if="item.itemAlocado" class="bg-success text-center"><strong>Alocado</strong></p>
                </li>
                <hr>
              </ul>
              <input class="btn btn-danger col-12 mb-5" type="button" value="Cancelar Separação"
                v-on:click="pularProduto">
              <hr>
            </div>
          </div>
        </div>
      </div>

      <div v-if="pedidosPendencia" class="mt-5">
        <div class="card">
          <div class="card-header">
            <h2 class="text-center text-danger">Pedidos com pendência</h2>
          </div>
          <div v-for="order in pedidosPendencia" :key="pedidosPendencia.externalId">
            <p class="text-center"><strong>Pedido: </strong>{{ order.externalId }}</p>
            <div class="text-align-center">
              <label class="row text-align-center">
                Identificação do Armário
                <input ref="inputArmario" v-model="order.armario" class="border p-2 col-12 text-center" type="text"
                  placeholder="código da baia" @keydown.enter="checaArmario(index)" />
              </label>
              <label class="row text-center">
                Identificação da baia
                <input ref="inputBaia" v-model="order.baia" class="border p-2 col-12" type="text"
                  placeholder="código da baia" @keydown.enter="checaBaia(index)" />
              </label>
            </div>
            <ul class="list-group list-group-flush" v-for="item in order.items" :key="order.items">
              <li class="list-group-item"><strong>Sku:</strong> {{ item.sku }}</li>
              <li class="list-group-item"><strong>Produto:</strong> {{ item.nome }}</li>
              <li class="list-group-item"><strong>Endereço:</strong> {{ item.location }}</li>
              <li class="list-group-item"><strong>Quantidade:</strong> {{ item.quantity }}</li>
              <li class="list-group-item"><strong>Quantidade separada:</strong> {{ item.qtdSeparado }}</li>
              <li class="list-group-item" @click="alertaQuantidadeAlocacao(item)"><strong>Quantidade alocada:</strong>
                {{ item.qtdSeparado || 0 }}</li>
              <li class="list-group-item">
                <label class="row">
                  <input v-model="eanProdAlocacao[order.items.sku]" class="border p-2 col-12" type="text"
                    placeholder="Código de barras do produto" @keydown.enter="curretItem" />
                </label>
              </li>
              <li class="list-group-item error-msg" v-if="error">{{ error }}</li>
            </ul>
            <input class="btn btn-danger col-12 mb-5" type="button" value="Cancelar Separação"
              v-on:click="pularProduto">
          </div>
        </div>
      </div>
    </div>
    <div v-if="status_separacao == 'atualizacao'">
      <div class="card d-flex justify-content-center align-items-center p-5">
        <p>Ao clicar você concluirá a tarefa corrente!</p>
        <input class="btn btn-primary col-12 " type="button" value="Concluir Separação" v-on:click="conclusao">
        <div v-if="spinningConclusao" class="spinner-border text-success" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-center text-danger" v-if="error">{{ error }}</p>
        <p class="text-center text-success" v-if="success">{{ success }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { LoadCurrentTask, LoadPendingTasks, LoadTask, LoadBay, LoadBayByOrder, UpdateBay, UpdateOrders } from '@/utils/others'

const status_separacao = ref('')
const emiteAlerta = ref(false)
const tasks = ref({
  status: false,
  data: []
});
const currentTask = ref({})
const router = useRouter()
const userStore = useUserStore()
const wave_picking = ref({
  task: [],
  items: []
})
const error = ref(null)
const success = ref(null)
const eanCapture = ref('')
const inputRef = ref(null);
const inputBaia = ref({});
const inputArmario = ref({});
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
    externalId: '',
    status: ''
  },
  separado: false,
  qtdSeparado: 0,
  pendente: false
})

const pedidosSeparados = ref(null)
const pedidosPendencia = ref(null)
const eanProdAlocacao = ref([])
const spinningConclusao = ref(false)

onMounted(async () => {
  try {

    userStore.carregarUsuario()
    tasks.value = await LoadCurrentTask('wave', userStore.usuario)
    if (tasks.value.status && tasks.value.data.length > 0) {
      currentTask.value = tasks.value.data[0]
      status_separacao.value = currentTask.value.status
      //console.log(currentTask.value)
      const statusFinalizacao = JSON.parse(localStorage.getItem('FINALIZATION'))
      if (statusFinalizacao) {
        reloadFinalizacao(statusFinalizacao)
      } else {
        const statusSeparation = JSON.parse(localStorage.getItem('SEPARATION'))
        if (statusSeparation && statusSeparation.task.id_picking == currentTask.value.id_picking) {
          wave_picking.value = { task: statusSeparation.task, items: statusSeparation.items }
          positionItem(wave_picking.value.items)
        } else {
          const data = await LoadTask('wave', currentTask.value.id_picking)
          const items = data.data.map(item => ({
            ...item,
            separado: false,
            qtdSeparado: 0,
            pendente: false
          }))
          wave_picking.value = { task: currentTask.value, items }
          localStorage.setItem('SEPARATION', JSON.stringify({ status_separacao: status_separacao.value, task: wave_picking.value.task, items: wave_picking.value.items }))
          positionItem(wave_picking.value.items)
        }
        reativarFoco()
      }
    } else {
      status_separacao.value = 'aguardando_separacao'
      tasks.value = await LoadPendingTasks('wave')
      console.log(tasks.value)
    }
  } catch (err) {
    console.log(err.message)
  }
})


async function focarInput() {
  await nextTick(() => {
    inputRef.value?.focus();
  })
}

// async function focarInput5x(retries = 5) {
//   await nextTick()
//   const tryFocus = () => {
//     if (inputRef.value) {
//       inputRef.value.focus()
//     } else if (retries > 0) {
//       setTimeout(() => focarInput(retries - 1), 100)
//     }
//   }
//   tryFocus()
// }

function reativarFoco() {
  setTimeout(() => {
    focarInput();
  }, 100);
}

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

function alertaQuantidade() {
  if (confirm("Ao confirmar você irá setar o total de produto como separado, faça isso somente ao pegar toda a quantidade do produto!")) {
    itemSeparacao.value.qtdSeparado = itemSeparacao.value.quantity
  }
}

function alertaQuantidadeAlocacao(produto) {
  if (confirm("Ao confirmar você irá setar o total de produto como alocado, faça isso somente ao garantir toda a quantidade do produto na baia escolhida!")) {
    produto.qtdAlocado = produto.quantity
  }
}

async function iniciarSeparacao(id) {
  try {
    const data = await LoadTask('wave', id)
    if (data.status) {
      const res = await UpdateOrders("em_separacao", data.data, id)
      if (res.status) {
        const items = data.data.map(item => ({
          ...item,
          separado: false,
          qtdSeparado: 0,
          pendente: false
        }))
        wave_picking.value = { task: res.picking, items }
        localStorage.setItem('SEPARATION', JSON.stringify({ status_separacao: status_separacao.value, task: wave_picking.value.task, items: wave_picking.value.items }))
        //console.log(wave_picking.value)
        positionItem(wave_picking.value.items)
        status_separacao.value = "em_separacao"
      }
    }
  } catch (err) {
    console.log(err.message)
  }
}

function positionItem(items) {
  for (let item in items) {
    restante.value = Number(item) + 1
    if (!items[item].separado && !items[item].pendente) {
      itemSeparacao.value = items[item]
      return
    }
  }
  status_separacao.value = "finalizacao"
  emiteAlerta.value = true
}

function pularProduto() {
  if (confirm("Esta ação irá indicar o produto como pendente em estoque! Deseja continuar?")) {
    itemSeparacao.value.pendente = true
    localStorage.setItem('SEPARATION', JSON.stringify({ status_separacao: status_separacao.value, task: wave_picking.value.task, items: wave_picking.value.items }))
    positionItem(wave_picking.value.items)
  }
}

function curretItem() {
  if (eanCapture.value == itemSeparacao.value.ean) {
    itemSeparacao.value.qtdSeparado = itemSeparacao.value.qtdSeparado < itemSeparacao.value.quantity ? itemSeparacao.value.qtdSeparado + 1 : itemSeparacao.value.qtdSeparado
    if (itemSeparacao.value.qtdSeparado == itemSeparacao.value.quantity) {
      itemSeparacao.value.separado = true
      localStorage.setItem('SEPARATION', JSON.stringify({ status_separacao: status_separacao.value, task: wave_picking.value.task, items: wave_picking.value.items }))
      positionItem(wave_picking.value.items)
    }
  } else {
    messageError("Produto não confere!");
  }
  eanCapture.value = ''
}

function messageError(message) {
  error.value = message
  setTimeout(() => {
    error.value = null
  }, 5000)
}
function messageSuccess(message) {
  success.value = message
  setTimeout(() => {
    success.value = null
  }, 5000)
  return true;
}


function separaPedidos(currentPicking) {
  const pendencia = []
  for (let item of currentPicking.items) {
    if (item.pendente) {
      pendencia.push(item.Order.externalId)
    }
  }

  pedidosSeparados.value = Object.values(
    currentPicking.items.reduce((acc, produto) => {
      if (!pendencia.includes(produto.Order.externalId)) {
        if (!acc[produto.Order.externalId]) {
          acc[produto.Order.externalId] = {
            externalId: produto.Order.externalId,
            armario: "",
            baia: "",
            confirma_baia: "n/a",
            items: [],
            alocado: false
          };
        }
        produto.qtdAlocado = 0;
        produto.itemAlocado = false;
        acc[produto.Order.externalId].items.push(produto);
      }
      return acc;
    }, {})
  );

  pedidosPendencia.value = Object.values(
    currentPicking.items.reduce((acc, produto) => {
      if (pendencia.includes(produto.Order.externalId)) {
        if (!acc[produto.Order.externalId]) {
          acc[produto.Order.externalId] = {
            externalId: produto.Order.externalId,
            armario: "",
            baia: "",
            confirma_baia: "n/a",
            items: [],
            alocado: false
          };
        }
        produto.qtdAlocado = 0;
        produto.itemAlocado = false;
        acc[produto.Order.externalId].items.push(produto);
      }
      return acc;
    }, {})
  );
  if (currentPicking.items.length > 0 && pedidosSeparados.value.length > 0) {
    emiteAlerta.value = false;
    //localStorage.setItem('FINALIZATION', JSON.stringify({ status_separacao: status_separacao.value, task: currentPicking.task, pedidosSeparados: pedidosSeparados.value, pedidosPendencia: pedidosPendencia.value }))
    localStorage.removeItem('SEPARATION')
  }
  if (pedidosSeparados.value.length == 0) {
    pedidosSeparados.value = null;
  }
  if (pedidosPendencia.value.length == 0) {
    pedidosPendencia.value = null;
  }
}

async function checaBaia(index) {
  if (inputBaia.value[index].value !== '') {
    const order_index = pedidosSeparados.value.findIndex(item => item.externalId === index);
    pedidosSeparados.value[order_index].confirma_baia = "consulta";
    const baia = await LoadBay(pedidosSeparados.value[order_index].armario, pedidosSeparados.value[order_index].baia);
    //console.log(baia)
    if (baia) {
      pedidosSeparados.value[order_index].confirma_baia = "registro";
      const registroBaia = await UpdateBay(pedidosSeparados.value[order_index].armario, pedidosSeparados.value[order_index].baia, pedidosSeparados.value[order_index].externalId);
      if (registroBaia) {
        inputBaia.value[index].disabled = true;
        pedidosSeparados.value[order_index].confirma_baia = "n/a";
        //localStorage.setItem('FINALIZATION', JSON.stringify({ status_separacao: status_separacao.value, task: currentTask.value.task, pedidosSeparados: pedidosSeparados.value, pedidosPendencia: pedidosPendencia.value }))

        //console.log(registroBaia);
      } else {
        inputBaia.value[index].disabled = false;
        inputArmario.value[index].disabled = false;
        pedidosSeparados.value[order_index].confirma_baia = "n/a";
        messageError(`Falha no registro da baia!`)
      }
    } else {
      pedidosSeparados.value[order_index].baia = '';
      pedidosSeparados.value[order_index].confirma_baia = "n/a";
      messageError("Baia não encontrada ou Ocupada!")
    }
  }
}
function checaArmario(index) {
  nextTick(() => {
    if (inputArmario.value[index].value !== '') {
      inputArmario.value[index].disabled = true;
      //console.log(pedidosSeparados.value[index].armario);
    }
  });
}

function currentAlocate(index, produto, order) {
  if (!order.armario || !order.baia) {
    messageError("Indique primeiramente o armário e a baia que sera depositado o produto!")
  } else {
    if (eanProdAlocacao.value[index] == produto.ean) {
      produto.qtdAlocado = produto.qtdAlocado < produto.quantity ? produto.qtdAlocado + 1 : produto.qtdAlocado;
      if (produto.qtdAlocado == produto.quantity) {
        produto.itemAlocado = true;
        const itemsAlocados = order.items.every(item => item.itemAlocado === true)
        order.alocado = itemsAlocados;
        const todosAlocados = pedidosSeparados.value.every(order_in => order_in.alocado === true);
        if (todosAlocados && !pedidosPendencia.value) {
          setTimeout(() => {
            status_separacao.value = "atualizacao";
          }, 2000);
        }
      }
    } else {
      messageError("Produto não confere!");
    }
  }
  eanProdAlocacao.value[index] = '';
}

watch([pedidosSeparados, pedidosPendencia], () => {
  localStorage.setItem('FINALIZATION', JSON.stringify({ status_separacao: status_separacao.value, task: currentTask.value, pedidosSeparados: pedidosSeparados.value, pedidosPendencia: pedidosPendencia.value }))
}, { deep: true });

async function cancelaSeparacao(task_id) {
  try {
    const data = await LoadTask('wave', task_id)
    if (data.status) {
      const res = await UpdateOrders("cancelado", data, task_id)
      if (res.status) {
        wave_picking.value = null
        localStorage.removeItem('SEPARATION')
        status_separacao.value = "aguardando_separacao"
      }
    } else {
      alert(data.message)
    }
  } catch (err) {
    console.log(err.message)
  }
}

function reloadFinalizacao(finalizacao) {
  //emiteAlerta.value = true
  currentTask.value = finalizacao.task
  pedidosSeparados.value = finalizacao.pedidosSeparados
  pedidosPendencia.value = finalizacao.pedidosPendencia
  status_separacao.value = "finalizacao"
  nextTick(() => {
    for (let order of pedidosSeparados.value) {
      //console.log(order)
      if (order.armario && !order.alocado) {
        inputArmario.value[order.externalId].disabled = true;
      }
      if (order.baia && !order.alocado) {
        inputBaia.value[order.externalId].disabled = true;
      }
    }
  });
  const todosAlocados = pedidosSeparados.value.every(order_in => order_in.alocado === true);
  if (todosAlocados && !pedidosPendencia.value) {
    status_separacao.value = "atualizacao";
  }
}

async function conclusao() {
  spinningConclusao.value = true;
  try {
    const data = await LoadTask('wave', currentTask.value.id_picking);
    setTimeout(async () => {
      if (!data.status) {
        throw new Error("Falha no carregamento da tarefa!");
      }
    }, 2000);

    if (data.status) {
      messageSuccess('Tarefas carregadas!');
      const ordersUpdate = await UpdateOrders('separado', data.data, currentTask.value.id_picking);
      await new Promise(resolve => setTimeout(resolve, 100)); // outra pequena pausa

      if (ordersUpdate.status) {
        if (messageSuccess('Produtos atualizados com sucesso!')) {
          localStorage.removeItem('FINALIZATION');
          tasks.value = await LoadPendingTasks('wave');
          status_separacao.value = 'aguardando_separacao';
        }
      } else {
        messageError('Falha na atualização! - UpdateOrders');
      }
    } else {
      messageError('Erro durante a conclusão - LoadTask');
    }
  } catch (error) {
    messageError(error.message)
    console.error('Erro durante conclusão:', error);
  } finally {
    spinningConclusao.value = false; // garantir que o spinner pare
  }
}






</script>

<style scoped>
.voltar-btn {
  position: fixed;
  top: 40px;
  left: 12px;
  z-index: 1000;
  background-color: #f3f4f6;
  /* cinza claro */
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.corpo {
  position: relative;
  top: 45px;
}

.iniciar {
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

.item-container h2,
.item-container h3 {
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
  justify-content: center;
  /* centraliza horizontalmente */
  align-items: center;
  /* centraliza verticalmente */
}

.pendente input {
  width: 100%;
  color: #333;
  background-color: #da5151;
  /* cinza claro */
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>