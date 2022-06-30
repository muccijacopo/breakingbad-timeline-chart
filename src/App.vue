<script setup lang="ts">
import dataset from './assets/dataset.json';
import episodes from './assets/episodes.json';
import Chart from './components/Chart.vue'
</script>

<template>
  <Chart :episodes="episodes.filter(e => e.series?.includes('Breaking Bad'))" :characters="dataset.slice(0, 20)" />
</template>

<style>
@import './assets/base.css';

#app {}
</style>
