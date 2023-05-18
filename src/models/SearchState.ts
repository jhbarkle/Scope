import { SimpleArtistObject } from "./Artist";

export type SearchState = {
  isLoading: boolean;
  artist: SimpleArtistObject;
  connectedArtists: SimpleArtistObject[];
  searchHistory: string[];
};
