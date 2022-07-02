import type { Episode } from "@/models/Episode";

export function getNumberOfEpisodesBySeason(
  allEpisodes: Episode[],
  season: number
): number {
  const episodes = allEpisodes.filter((e: Episode) => +e.season == season);
  return episodes.length;
}
