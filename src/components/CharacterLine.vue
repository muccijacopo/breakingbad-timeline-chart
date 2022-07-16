<template>
    <g class="character-entry">
        <circle :cx="positions[0].x" :cy="positions[0].y" r="30" :fill="randomColor"></circle>
        <text :x="positions[0].x" :y="positions[0].y" text-anchor="middle">{{ name }}</text>
        <line v-for="(position, idx) in positions" :x1="position.x" :y1="position.y"
            :x2="positions[idx + 1]?.x ?? position.x" :y2="positions[idx + 1]?.y ?? position.y" :stroke="randomColor"
            class="character-line"
        >

        </line>
    </g>
</template>

<script setup lang="ts">
const props = defineProps(["name", "positions"])
const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`
</script>

<style scoped>
text {
    fill: var(--color-text);
}

line {
    stroke-width: 3px;
    transition: all 0.2s ease;
}

/* line:hover {
    stroke-width: 10px;
} */
</style>