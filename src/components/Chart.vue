<template>
    <div class="chart">
        <svg v-if="isReady">
            <CharacterLine v-for="(character, idx) in characters" :character="character"
                :positions="positionsByCharacter[character.id]" @on-character-hover="updateTooltip($event)" />
        </svg>
        <div :style="{ height: characters.length * 30 + 'px' }"></div>
        <div v-for="(episode, idx) in episodes" class="episode-card" :style="{
            top: positionsByEpisode[idx].y + 'px',
            left: positionsByEpisode[idx].x + 'px',
            height: episodeAreaHeight + 'px',
            width: episodeAreaWidth + 'px',
        }">
            {{ episode.season }} / {{ episode.episode }} ({{ episode.title }})
        </div>
        <Tooltip :visible="tooltip.visible" :position="{ x: tooltip.x, y: tooltip.y }" :data="tooltip.data" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import type { Character } from "@/models/Character";
import type { Episode } from "@/models/Episode";
import { isBeforeThan, getNumberOfEpisodesFromPilot } from "@/utils/utils";
import { getVariables } from '@/utils/variables';
import type { Point } from "@/models/Coordinates";
import CharacterLine, { type CharacterLineInteraction } from "./CharacterLine.vue";
import Tooltip from "@/components/Tooltip.vue";

/** Props */
const props = defineProps(["episodes", "characters"]);
/** Constants */
const { characterLineHeight,
    marginBetweenCharacterLines,
    extraLeftArea,
    episodeAreaWidth,
    episodeAreaHeight,
    marginBetweenEpisodes
} = getVariables(props.characters);
/** Reactive state */
const positionsByCharacter = ref<any>({});
const positionsByEpisode = ref<Point[]>(calculateEpisodeCardsCoordinates());
const isReady = ref(false);
const tooltip = reactive({
    visible: false,
    x: 0,
    y: 0,
    data: props.characters[0]
});


/** Functions */
function getXPositionByEpisode(episode: number, season: number) {
    const total = getNumberOfEpisodesFromPilot(episode, season, props.episodes);
    const x = (positionsByEpisode.value[total - 1].x as number);
    return x;
}

function getCharacterInitialXPosition(episode: number, season: number) {
    const total = getNumberOfEpisodesFromPilot(episode, season, props.episodes);
    const x = (positionsByEpisode.value[total - 1].x as number) - marginBetweenEpisodes;
    return x;
}

function getCharacterDefaultY(idx: number, total: number, offset: number) {
    if (idx < total / 2) return idx * (characterLineHeight + marginBetweenCharacterLines);
    else return offset + (idx * (characterLineHeight + marginBetweenCharacterLines));
}

function getCharacterIntoEpisodeY(idx: number, offset: number) {
    return offset + (idx * (characterLineHeight + marginBetweenCharacterLines));
}

function calculateEpisodeCardsCoordinates(
    episodes: Episode[] = props.episodes,
    characters: Character[] = props.characters
): Point[] {
    const y = (characters.length / 2) * (characterLineHeight + marginBetweenCharacterLines);
    const r = episodes.map((_, idx) => {
        if (idx == 0) return { x: extraLeftArea, y };
        else
            return {
                x: extraLeftArea + ((episodeAreaWidth + marginBetweenEpisodes) * idx),
                y,
            };
    });
    return r;
}

function calculateCharactersCoordinates(
    characters: Character[] = props.characters,
    episodes: Episode[] = props.episodes
) {
    if (!characters || !episodes) return {};
    const r: { [key: number]: { x: number | string; y: number | string }[] } = {};
    const episodeCardTopY = positionsByEpisode.value[0].y;
    const episodeCardBottomY = episodeCardTopY + episodeAreaHeight;
    characters.forEach((character, idx) => {
        // Calculate default Y position
        const defaultYPosition = getCharacterDefaultY(idx, characters.length, episodeCardBottomY);

        const firstAppearance = character.appearances[0];
        if (!r[character.id]) {
            r[character.id] = [
                {
                    x: getCharacterInitialXPosition(
                        +firstAppearance.episode,
                        +firstAppearance.season
                    ),
                    y: defaultYPosition,
                },
                {
                    x:
                        getCharacterInitialXPosition(
                            +firstAppearance.episode,
                            +firstAppearance.season
                        ) + 150,
                    y: defaultYPosition,
                },
            ];
        }
        let deathSeason;
        let deathEpisode;
        deathSeason = character.death ? deathSeason = character.death.season : deathSeason = null;
        deathEpisode = character.death ? deathEpisode = character.death.episode : deathEpisode = null;
        for (const ep of episodes) {
            if (Number(ep.episode) !== deathEpisode || Number(ep.season) !== deathSeason) {

                if (isBeforeThan(ep, firstAppearance as any)) continue;

                const app = character.appearances.find(
                    (e) => +e.episode == +ep.episode && +e.season == +ep.season
                );

                r[character.id].push({
                    y: app ? getCharacterIntoEpisodeY(idx, episodeCardTopY) : defaultYPosition,
                    x: getXPositionByEpisode(+ep.episode, +ep.season),
                });
            } else {
                r[character.id][r[character.id].length - 1].x = r[character.id][r[character.id].length - 1].x + (episodeAreaWidth / 2);
                break;
            }

        }
    });

    return r;
}

function updateTooltip(e: CharacterLineInteraction) {
    tooltip.x = e.x;
    tooltip.y = e.y
    tooltip.visible = !e.leave;
    const character = (props.characters as Character[]).find(c => c.id == e.characterId);
    if (character) tooltip.data = character;

}

onMounted(() => {
    positionsByCharacter.value = calculateCharactersCoordinates();
    isReady.value = true;
});
</script>

<style scoped>
.chart {
    padding: 2rem;
    position: relative;
    width: 100vw;
    height: 100vh;
    border: 1px solid #282828;
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
