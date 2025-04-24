<!-- src/components/VoltarBtn.vue -->
<template>
    <button @click="voltar" class="voltar-btn">
      ←
    </button>
    <br>
    <hr>
    <h1>Separação por lote</h1>
</template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  const router = useRouter()
  
  function voltar() {
    router.back()
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
  </style>
  