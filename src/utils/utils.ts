import type { Episode } from "@/models/Episode";

export function getNumberOfEpisodesBySeason(
  allEpisodes: Episode[],
  season: number
): number {
  const episodes = allEpisodes.filter((e: Episode) => +e.season == season);
  return episodes.length;
}

export function getNumberOfEpisodesFromPilot(
  episode: number,
  season: number,
  data: Episode[]
) {
  let totalEpisodes = 0;
  if (season > 1)
    for (const s of Array.from(Array(season)).keys()) {
      totalEpisodes += getNumberOfEpisodesBySeason(data, s);
    }
  totalEpisodes += episode;
  return totalEpisodes;
}

export function isBeforeThan(a: Episode, b: Episode) {
  return a.season < b.season || (a.season == b.season && a.episode < b.episode);
}

export function isFirstEpisode(season: number, episode: number) {
  return season == 1 && episode == 1;
}
