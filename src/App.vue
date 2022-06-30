<script setup lang="ts">
import dataset from './assets/dataset.json';
import episodes from './assets/episodes.json';
import Chart from './components/Chart.vue'
</script>

<template>
  <Chart :episodes="episodes" />
</template>

<style>
@import './assets/base.css';

#app {
  padding: 1rem;
}
</style>
