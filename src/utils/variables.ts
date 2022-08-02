import type { Character } from "@/models/Character";

export function getVariables(characters: Character[]) {
  /** @warning needs to be changed also in Character Line Component's CSS */
  const characterLineHeight = 29;
  const marginBetweenCharacterLines = 5;
  const extraLeftArea = 300;
  const episodeAreaWidth = 100;
  const episodeAreaHeight =
    characters.length * (characterLineHeight + marginBetweenCharacterLines);
  const marginBetweenEpisodes = 300;
  return {
    characterLineHeight,
    marginBetweenCharacterLines,
    extraLeftArea,
    episodeAreaWidth,
    episodeAreaHeight,
    marginBetweenEpisodes,
  };
}
