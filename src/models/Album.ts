import { SimpleArtistObject } from "./Artist";

export type SimpleAlbumObject = {
  albumType: string;
  totalTracks: number;
  id: string;
  image: string;
  name: string;
  releaseDate: string;
  uri: string;
  genres: string[];
  label: string;
  popularity: number;
  artists: SimpleArtistObject[];
};
