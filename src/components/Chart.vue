<template>
    <div class="chart">
        <svg>
            <CharacterLine v-for="(character, idx) in characters" :name="character.name"
                :positions="positionsByCharacter[character.id]" />
        </svg>
        <div :style="{ height: characters.length * 30 + 'px' }"></div>
        <div v-for="(episode, idx) in episodes" class="episode-card"
            :style="{ top: '50vh', left: ((episodeAreaWidth - episodeCardWidth) / 2) + (idx * episodeAreaWidth) + 'px', transform: 'translateY(-50%)' }">
            {{ episode.season }} / {{ episode.episode }}
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Character } from "@/models/Character";
import type { Episode } from "@/models/Episode";
import { ref } from "vue";
import CharacterLine from "./CharacterLine.vue";
const props = defineProps(["episodes", "characters"])

const episodeAreaWidth = 300;
const episodeAreaHeight = 300;
const episodeCardWidth = 100;

function getNumberOfEpisodesBySeason(season: number): number {
    const episodes = props.episodes.filter((e: Episode) => +e.season == season);
    return episodes.length;
}

function getXPositionByEpisode(episode: number, season: number) {
    if (season == 1 && episode == 1) return 30;
    let totalEpisodes = 0;
    for (const s of Array.from(Array(season)).keys()) {
        totalEpisodes += getNumberOfEpisodesBySeason(s);
    }
    totalEpisodes += episode;
    const x = episodeAreaWidth * totalEpisodes;
    return x
}

function calculatePositionsByCharacter(characters: Character[] = props.characters, episodes: Episode[] = props.episodes) {
    if (!characters || !episodes) return {};
    const r: { [key: number]: { x: number, y: number }[] } = {};
    characters.forEach((character, idx) => {
        const y = idx * 80;
        character.appearances.forEach(appearance => {
            if (!r[character.id]) r[character.id] = [];
            r[character.id].push({ x: getXPositionByEpisode(+appearance.episode, +appearance.season), y })
        })
    })
    return r;
}

const positionsByCharacter = ref(calculatePositionsByCharacter())


</script>

<style scoped>
.chart {
    padding: 2rem;
    position: relative;
    width: 100vw;
    height: 100vh;
    border: 1px solid white;
    overflow: scroll;
}

svg {
    width: 100%;
    height: 100%;
    overflow: visible;
}

.line {
    position: absolute;
    height: 100%;
    width: 1px;
    color: white;
}

.character {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    position: absolute;
}

.episode-card {
    position: absolute;
    background: #fafafa;
    color: var(--color-background);
    padding: 5px 10px;
    text-overflow: ellipsis;
    width: 100px;
}
</style>