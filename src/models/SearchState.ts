import { SimpleArtistObject } from "./Artist";

export type SearchState = {
  searchQueryFromUser: string;
  isLoading: boolean;
  artist: SimpleArtistObject | undefined;
  connectedArtists: SimpleArtistObject[] | undefined;
  searchHistory: string[];
  isSearching: boolean;
};

export const defaultSearchState: SearchState = {
  isLoading: false,
  artist: undefined,
  connectedArtists: undefined,
  searchHistory: [],
  searchQueryFromUser: "Did you get this from the context?",
  isSearching: false,
};
