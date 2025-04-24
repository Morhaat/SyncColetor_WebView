<template>
    <div class="voltar-container">
        <button @click="voltar" class="voltar-btn">
        ←
        </button>
        <hr>
    </div>
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
    margin-top: 50px;
    margin-left: 12px;
    background-color: #f3f4f6; /* cinza claro */
    border: none;
    border-radius: 8px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 16px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .voltar-container{
    top:0px;
    position: fixed;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.3); /* cinza claro */
    width:100%
  }
</style>