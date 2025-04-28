<template>
  <NavBarWeb :nivel_acesso = "Number(userStore.nivel_acesso)"></NavBarWeb>
  <div class="container">
    <div style="margin-top: 100px !important;">
      <section class="row justify-content-center">
        <article class="col-sm-8 col-sm-12 col-md-6 col-lg-4 card text-bg-warning m-2" style="width: 18rem;">
          <div class="card-body">
            <h5 class="card-title">Pedidos aguardando separação</h5>
            <p class="card-text">20 pedidos</p>
          </div>
        </article>
        <article class="col-sm-8 col-sm-12 col-md-6 col-lg-4 card text-bg-primary m-2" style="width: 18rem;">
          <div class="card-body">
            <h5 class="card-title">Pedidos em separação</h5>
            <p class="card-text">3 pedidos</p>
          </div>
        </article>
        <article class="col-sm-8 col-sm-12 col-md-6 col-lg-4 card text-bg-success m-2" style="width: 18rem;">
          <div class="card-body">
            <h5 class="card-title">Pedidos separados</h5>
            <p class="card-text">40 pedidos</p>
          </div>
        </article>
      </section>
    </div>
    <section class="row justify-content-center">
      <article class="d-none d-md-none d-lg-block col-md-6 col-lg-5 card m-2" style="height: 300px;">
        <StatusChart></StatusChart>
      </article>
      <article class="d-none d-md-none d-lg-block col-md-6 col-lg-5 card m-2" style="height: 300px;">
        <TimeSeparation></TimeSeparation>
      </article>
    </section>
  </div>
</template>

<script setup>
import NavBarWeb from '@/components/NavBarWeb.vue'
import StatusChart from '@/components/charts/StatusChart.vue'
import TimeSeparation from '@/components/charts/TimeSeparation.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { verificarSessao } from '@/services/authService'


const router = useRouter()
const error = ref(null)
const navType = ref(false)

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

</script>

