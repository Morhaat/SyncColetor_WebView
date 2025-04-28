<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <router-view />
</template>

<style>
/* Aplica o background degradê global */
body, #app {
  top: env(safe-area-inset-top, 0);
  min-height: 100dvh;
  margin: 0;
  padding: 0;
  background: linear-gradient(to right, #0f2027, #203a43, #2c5364);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: white;
  margin-top: 40px;
}
</style>