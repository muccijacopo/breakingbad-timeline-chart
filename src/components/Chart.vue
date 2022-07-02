<template>
    <div class="chart">
        <svg v-if="isReady">
            <CharacterLine v-for="(character, idx) in characters" :name="character.name"
                :positions="positionsByCharacter[character.id]" />
        </svg>
        <div :style="{ height: characters.length * 30 + 'px' }"></div>
        <div v-for="(episode, idx) in episodes" class="episode-card" :ref="(el) => (episodesRefs[idx] = el)" :style="{
            top: '50vh',
            left:
                (episodeAreaWidth - episodeCardWidth) / 2 +
                idx * episodeAreaWidth +
                'px',
            transform: 'translateY(-50%)',
        }">
            {{ episode.season }} / {{ episode.episode }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Character } from "@/models/Character";
import type { Episode } from "@/models/Episode";
import { getNumberOfEpisodesBySeason } from "@/utils/utils";
import CharacterLine from "./CharacterLine.vue";

const props = defineProps(["episodes", "characters"]);

const episodeAreaWidth = 300;
const episodeAreaHeight = 200;
const episodeCardWidth = 100;

function getXPositionByEpisode(episode: number, season: number) {
    episode -= 1;
    let totalEpisodes = 0;
    if (season > 1)
        for (const s of Array.from(Array(season)).keys()) {
            totalEpisodes += getNumberOfEpisodesBySeason(props.episodes, s);
        }
    totalEpisodes += episode;
    const x = (episodeAreaWidth * totalEpisodes) - ((episodeAreaWidth - episodeCardWidth) / 2);
    return x;
}

function getTopPositionOfEpisodeArea() {
    const rect = (episodesRefs.value?.[0] as HTMLElement)?.getBoundingClientRect();
    if (!rect) return 0;
    return rect.top;
}

function calculatePositionsByCharacter(
    characters: Character[] = props.characters,
    episodes: Episode[] = props.episodes
) {
    if (!characters || !episodes) return {};
    const r: { [key: number]: { x: number | string; y: number | string }[] } = {};
    const top = getTopPositionOfEpisodeArea();
    characters.forEach((character, idx) => {
        // Initialize character position (bullet image)
        if (!r[character.id]) {
            let y = idx * 90;
            if (y > top && y < top + episodeAreaHeight) y = y + episodeAreaHeight;
            r[character.id] = [
                {
                    x: getXPositionByEpisode(
                        +character.appearances[0].episode,
                        +character.appearances[0].season
                    ),
                    y: idx * 90,
                },
                {
                    x:
                        getXPositionByEpisode(
                            +character.appearances[0].episode,
                            +character.appearances[0].season
                        ) + 60,
                    y: idx * 90,
                },
            ];
        }

        for (const [epIdx, ep] of episodes.entries()) {
            let y = r[character.id][epIdx > 1 ? epIdx - 1 : 0].y;
            const app = character.appearances.find(
                (e) => +e.episode == +ep.episode && +e.season == +ep.season
            );
            // character appearance move y to episode area
            if (app) y = top + 10 * idx;
            character.appearances.forEach((appearance) => {
                r[character.id].push({
                    x: getXPositionByEpisode(+appearance.episode, +appearance.season),
                    y,
                });
            });
        }
    });
    return r;
}

const episodesRefs = ref<any>([]);
let positionsByCharacter = ref<any>({});
const isReady = ref(false);

onMounted(() => {
    positionsByCharacter.value = calculatePositionsByCharacter();
    isReady.value = true;
})

console.log(episodesRefs.value);
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
    border-radius: 12px;
    transition: opacity 0.5s ease;
}

.episode-card:hover {
    opacity: 1;
}
</style>
