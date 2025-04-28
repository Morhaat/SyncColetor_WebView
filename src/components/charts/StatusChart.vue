<template>
    <div class="chart-wrapper">
      <Chart :data="chartData" :options="chartOptions" :type="'doughnut'" />
    </div>
  </template>
  
  <script setup>
  import { Chart } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, ArcElement)

  
  const chartData = {
    labels: ['Separados', 'Pendentes'],
    datasets: [
      {
        label: 'Status de Separação',
        data: [40, 20],
        backgroundColor: ['#10b981', '#ef4444'],
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
        text: 'Status dos Pedidos',
        color: 'black',
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
  