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
    episode -= 1;
    let totalEpisodes = 0;
    if (season > 1)
        for (const s of Array.from(Array(season)).keys()) {
            totalEpisodes += getNumberOfEpisodesBySeason(s);
        }
    totalEpisodes += episode;
    const x = (episodeAreaWidth * totalEpisodes);
    return x
}

function calculatePositionsByCharacter(characters: Character[] = props.characters, episodes: Episode[] = props.episodes) {
    if (!characters || !episodes) return {};
    const r: { [key: number]: { x: number, y: number }[] } = {};
    characters.forEach((character, idx) => {
        // Initialize character position (bullet image)
        if (!r[character.id]) r[character.id] = [
            { x: getXPositionByEpisode(+character.appearances[0].episode, +character.appearances[0].season), y: idx * 90 },
            { x: getXPositionByEpisode(+character.appearances[0].episode, +character.appearances[0].season) + 100, y: idx * 90 }
        ]
        let x: number;
        let y: number;
        for (const ep of episodes) {
            const app = character.appearances.find(e => +e.episode == +ep.episode && +e.season == +ep.season);
            // character appearance move y to episode area
            if (app) y = 320 + (10 * idx);
            else y = (idx * 90)
        }
        character.appearances.forEach(appearance => {
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
    background: var(--color-text);
    color: var(--color-background);
    height: 200px;
    width: 30px;
    writing-mode: vertical-rl;
    display: flex;
    justify-content: center;
    align-items: center;
    text-overflow: ellipsis;
    width: 100px;
    opacity: 0.7;
}
</style>