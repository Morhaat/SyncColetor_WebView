<template>
    <div class="chart-wrapper">
      <Chart :data="chartData" :options="chartOptions" :type="'bar'" />
    </div>
  </template>
  
  <script setup>
  import { onMounted, nextTick } from 'vue'
  import { Chart } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
  } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  
  const chartData = {
    labels: ['20/04', '21/04', '22/04'],
    datasets: [
      {
        label: 'Pedidos Integrados',
        data: [45, 32, 50],
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Tempo Médio (min)',
        data: [12, 18, 14],
        backgroundColor: '#f59e0b',
      },
    ],
  }
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'black',
        },
      },
      title: {
        display: true,
        text: 'Pedidos x Tempo de Separação',
        color: 'black',
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'black',
        },
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
      },
      y: {
        ticks: {
          color: 'black',
        },
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
      },
    },
  }
  

  </script>
  
  <style scoped>
  .chart-wrapper {
    width: 100%;
    height: 300px;
    display: block;
  }
  canvas {
    display: block !important;
    width: 100% !important;
    height: 100% !important;
  }
  </style>
  