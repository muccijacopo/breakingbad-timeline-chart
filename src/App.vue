<script setup lang="ts">
import dataset from './assets/dataset.json';
import episodes from './assets/episodes.json';
import Chart from './components/Chart.vue'
</script>

<template>
  <!-- <div class="div-title">
    <img src="title.png"  margin-left="300px" class="img-title">
  </div> -->

  <Chart :episodes="episodes.filter(e => e.series?.includes('Breaking Bad'))" :characters="dataset" />
</template>

<style>
@import './assets/base.css';

.div-title {
  display: flex;
  justify-content: center;
}

.img-title {
  width: 300px;
}
</style>
