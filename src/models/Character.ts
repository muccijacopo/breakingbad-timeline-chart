interface Episode {
  season: number;
  episode: number;
  title_ep: string;
}

export interface Character {
  id: number;
  name: string;
  nickname: string;
  img: string;
  death?: Episode;
  appearances: Episode[];
}
