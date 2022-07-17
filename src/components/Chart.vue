<template>
    <div class="chart">
        <svg v-if="isReady">
            <CharacterLine v-for="(character, idx) in characters" :character="character"
                :positions="positionsByCharacter[character.id]" @on-character-hover="updateTooltip($event)" />
        </svg>
        <div :style="{ height: characters.length * 30 + 'px' }"></div>
        <div v-for="(episode, idx) in episodes" class="episode-card" :ref="(el) => (episodesRefs[idx] = el)" :style="{
            top: positionsByEpisode[idx].y + 'vh',
            left: positionsByEpisode[idx].x + 'px',
            transform: 'translateY(-50%)',
            height: episodeAreaHeight + 'px',
            width: episodeCardWidth + 'px',
        }">
            {{ episode.season }} / {{ episode.episode }}
        </div>
        <Tooltip :visible="tooltip.visible" :position="{ x: tooltip.x, y: tooltip.y }" :data="tooltip.data" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import type { Character } from "@/models/Character";
import type { Episode } from "@/models/Episode";
import { getNumberOfEpisodesBySeason, isBeforeThan } from "@/utils/utils";
import type { Point } from "@/utils/utils";
import CharacterLine, { type CharacterLineInteraction } from "./CharacterLine.vue";
import Tooltip from "@/components/Tooltip.vue";

const props = defineProps(["episodes", "characters"]);

const extraLeftArea = 300;
const episodeAreaWidth = 300;
const episodeAreaHeight = 300;
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
    const x = episodeAreaWidth * totalEpisodes;
    return x;
}

function getTopPositionOfEpisodeArea() {
    const rect = (
        episodesRefs.value?.[5] as HTMLElement
    )?.getBoundingClientRect();
    if (!rect) return 0;
    return rect.top;
}

function calculatePositionsByEpisode(
    episodes: Episode[] = props.episodes
): Point[] {
    const r = episodes.map((_, idx) => {
        if (idx == 0) return { x: extraLeftArea + episodeHalfArea, y: 50 };
        else
            return {
                x: extraLeftArea + episodeAreaWidth * idx,
                y: 50,
            };
    });
    return r;
}

function calculatePositionsByCharacter(
    characters: Character[] = props.characters,
    episodes: Episode[] = props.episodes
) {
    if (!characters || !episodes) return {};
    const r: { [key: number]: { x: number | string; y: number | string }[] } = {};
    const top = getTopPositionOfEpisodeArea();
    characters.forEach((character, idx) => {
        // Calculate default Y position
        let defaultYPosition = idx * 90;
        if (defaultYPosition > top && defaultYPosition < top + episodeAreaHeight)
            defaultYPosition = defaultYPosition + episodeAreaHeight;

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
                y: app ? top + 20 * idx : defaultYPosition,
                x: getXPositionByEpisode(+ep.episode, +ep.season),
            });
        }
    });
    return r;
}

function updateTooltip(e: CharacterLineInteraction) {
    console.log(e)
    tooltip.x = e.x;
    tooltip.y = e.y
    tooltip.visible = !e.leave;
    const character = (props.characters as Character[]).find(c => c.id == e.characterId);
    if (character) tooltip.data = character;

}

/** State */
const episodesRefs = ref<any>([]);
const positionsByCharacter = ref<any>({});
const positionsByEpisode = ref<Point[]>(calculatePositionsByEpisode());
const isReady = ref(false);
const tooltip = reactive({
    visible: false,
    x: 0,
    y: 0,
    data: props.characters[0]
});

onMounted(() => {
    positionsByCharacter.value = calculatePositionsByCharacter();
    isReady.value = true;
});
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
    font-weight: bold;
    font-size: 1.2rem;
    writing-mode: vertical-rl;
    display: flex;
    justify-content: center;
    align-items: center;
    text-overflow: ellipsis;
    width: 100px;
    opacity: 0.5;
    /* border-radius: 12px; */
    transition: opacity 0.5s ease;
}
</style>
