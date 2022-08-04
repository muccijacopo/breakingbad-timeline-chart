<template>
    <div v-if="visible" class="tooltip" :style="{ top: position.y + 'px', left: +position.x + 60 + 'px' }">
        <img rel="preload" :src="data.img" />
        <h3>{{ data.name }}</h3>
        <p>({{ data.nickname }})</p>
    </div>
</template>

<script setup lang="ts">
import type { Character } from '@/models/Character';
import type { Point } from '@/models/Coordinates';
const props = defineProps<{ visible: boolean, position: Point, data: Character }>()
</script>

<style scoped>
.tooltip {
    position: absolute;
    width: 150px;
    background: var(--color-card);
    color: var(--color-text);
    padding: 5px;
    text-align: center;
}

img {
    display: block;
    width: 50px;
    height: 50px;
    margin: 0 auto;
    border-radius: 50%;
}
</style>