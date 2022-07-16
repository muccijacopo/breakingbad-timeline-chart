<template>
    <div class="chart">
        <svg v-if="isReady">
            <CharacterLine v-for="(character, idx) in characters" :name="character.name"
                :positions="positionsByCharacter[character.id]" />
        </svg>
        <div :style="{ height: characters.length * 30 + 'px' }"></div>
        <div v-for="(episode, idx) in episodes" class="episode-card" :ref="(el) => (episodesRefs[idx] = el)" :style="{
            top: positionsByEpisode[idx].y + 'vh',
            left: positionsByEpisode[idx].x + 'px',
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
import { getNumberOfEpisodesBySeason, isBeforeThan } from "@/utils/utils";
import type { Point } from '@/utils/utils';
import CharacterLine from "./CharacterLine.vue";

const props = defineProps(["episodes", "characters"]);

const extraLeftArea = 300;
const episodeAreaWidth = 300;
const episodeAreaHeight = 200;
const episodeCardWidth = 100;
const episodeHalfArea = (episodeCardWidth - episodeCardWidth) / 2;

function getXPositionByEpisode(episode: number, season: number) {
    episode -= 1;
    let totalEpisodes = 0;
    if (season > 1)
        for (const s of Array.from(Array(season)).keys()) {
            totalEpisodes += getNumberOfEpisodesBySeason(props.episodes, s);
        }
    totalEpisodes += episode;
    // const x = (episodeAreaWidth * totalEpisodes) - ((episodeAreaWidth - episodeCardWidth) / 2);
    const x = (episodeAreaWidth * totalEpisodes);
    return x;
}

function getTopPositionOfEpisodeArea() {
    const rect = (episodesRefs.value?.[5] as HTMLElement)?.getBoundingClientRect();
    if (!rect) return 0;
    return rect.top;
}

function calculatePositionsByEpisode(episodes: Episode[] = props.episodes): Point[] {
    const r = episodes.map((_, idx) => {
        if (idx == 0) return ({ x: extraLeftArea + episodeHalfArea, y: 50 });
        else return {
            x: extraLeftArea + episodeAreaWidth * idx,
            y: 50
        }
    })
    return r;
}


function calculatePositionsByCharacter(
    characters: Character[] = props.characters,
    episodes: Episode[] = props.episodes
) {
    if (!characters || !episodes) return {};
    const r: { [key: number]: { x: number | string; y: number | string }[] } = {};
    const top = getTopPositionOfEpisodeArea();
    debugger;
    characters.forEach((character, idx) => {
        // Calculate default Y position
        let defaultYPosition = idx * 90;
        if (defaultYPosition > top && defaultYPosition < top + episodeAreaHeight) defaultYPosition = defaultYPosition + episodeAreaHeight;

        const firstAppearance = character.appearances[0];
        if (!r[character.id]) {
            r[character.id] = [
                {
                    x: getXPositionByEpisode(
                        +firstAppearance.episode,
                        +firstAppearance.season
                    ),
                    y: defaultYPosition,
                },
                {
                    x:
                        getXPositionByEpisode(
                            +firstAppearance.episode,
                            +firstAppearance.season
                        ) + 60,
                    y: defaultYPosition,
                },
            ];
        }

        for (const [epIdx, ep] of episodes.entries()) {
            if (isBeforeThan(ep, firstAppearance as any)) continue;
            const app = character.appearances.find(
                (e) => +e.episode == +ep.episode && +e.season == +ep.season
            );
            r[character.id].push({
                y: app ? top + 10 * idx : defaultYPosition,
                x: getXPositionByEpisode(+ep.episode, +ep.season)
            })
        }
    });
    return r;
}

const episodesRefs = ref<any>([]);
const positionsByCharacter = ref<any>({});
const positionsByEpisode = ref<Point[]>(calculatePositionsByEpisode());
const isReady = ref(false);

onMounted(() => {
    positionsByCharacter.value = calculatePositionsByCharacter();
    isReady.value = true;
})

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
