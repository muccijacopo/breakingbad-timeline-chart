import type { Character } from "@/models/Character";

export function getVariables(characters: Character[]) {
  /** @warning needs to be changed also in Character Line Component's CSS */
  const characterLineHeight = 10;
  const marginBetweenCharacterLines = 10;
  const extraLeftArea = 300;
  const episodeAreaWidth = 300;
  const episodeAreaHeight =
    characters.length * (characterLineHeight + marginBetweenCharacterLines);
  const episodeCardWidth = 100;
  const episodeHalfArea = (episodeAreaWidth - episodeCardWidth) / 2;
  return {
    characterLineHeight,
    marginBetweenCharacterLines,
    extraLeftArea,
    episodeAreaWidth,
    episodeAreaHeight,
    episodeCardWidth,
    episodeHalfArea,
  };
}
