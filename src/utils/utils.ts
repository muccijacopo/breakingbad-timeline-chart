import type { Episode } from "@/models/Episode";



export function getNumberOfEpisodesBySeason(
  allEpisodes: Episode[],
  season: number
): number {
  const episodes = allEpisodes.filter((e: Episode) => +e.season == season);
  return episodes.length;
}

export function isBeforeThan(a: Episode, b: Episode) {
  return a.season < b.season || (a.season == b.season && a.episode < b.episode);
}
