<template>
    <g class="character-entry">
        <circle :cx="positions[0].x" :cy="positions[0].y" r="30" :fill="randomColor"></circle>
        <g :class="'character-' + character.name" @mousemove="onMouseHover($event)">
            <line v-for="(position, idx) in positions" :x1="position.x" :y1="position.y"
                :x2="positions[idx + 1]?.x ?? position.x" :y2="positions[idx + 1]?.y ?? position.y"
                :stroke="randomColor" @mousemove="onMouseHover($event)" @mouseleave="onMouseLeave($event)">
            </line>
        </g>
         
        <text :x="positions[0].x" :y="positions[0].y" text-anchor="middle">{{ character.name }}</text>
    </g>
</template>

<script setup lang="ts">
import { getVariables } from '@/utils/variables';

export interface CharacterLineInteraction {
    characterId: number;
    x: number;
    y: number;
    leave?: boolean;
}
const props = defineProps(["character", "positions"])
const emit = defineEmits<{ (e: "onCharacterHover", payload: CharacterLineInteraction): void }>();
const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`

function onMouseHover(event: MouseEvent) {
    emit('onCharacterHover', { characterId: props.character.id, x: event.offsetX, y: event.offsetY })
}
function onMouseLeave(event: MouseEvent) {
    emit('onCharacterHover', { characterId: props.character.id, x: event.offsetX, y: event.offsetY, leave: true })
}
</script>

<style scoped>
text {
    fill: var(--color-text);
    z-index: 2;
}

line {
    stroke-width: 10px;
    stroke-linecap: round;
    transition: all 0.2s ease;
    cursor: pointer;
}

/* line:hover {
    stroke-width: 10px;
} */
line {
    z-index: 1;
}

g[class^="character-"]:hover line {
    stroke-width: 12px;
}
</style>