<template>
    <div v-if="visible" class="tooltip" :style="{ top: position.y + 'px', left: position.x + 'px' }">
        <h4>{{ data.name }}</h4>
    </div>
</template>

<script setup lang="ts">
import type { Character } from '@/models/Character';
import type { Point } from '@/utils/utils';
const props = defineProps<{ visible: boolean, position: Point, data: Character }>()
</script>

<style scoped>
.tooltip {
    position: absolute;
    width: 60px;
    height: 100px;
    background: var(--color-background);
    color: var(--color-text);
    padding: 5px;
}
</style>