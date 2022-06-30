<template>
    <div class="chart">
        <div v-for="(episode, idx) in episodes" class="episode-card"
            :style="{ top: '50vh', left: (idx * 250) + 'px', transform: 'translateY(-50%)' }">
            {{
                    episode.title
            }}</div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(["episodes"])
</script>

<style scoped>
.chart {}

.episode-card {
    position: absolute;
    background: #fafafa;
    color: var(--color-background);
    padding: 5px 10px;
    text-overflow: ellipsis;
    width: 100px;
}
</style>