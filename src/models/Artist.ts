import { SimpleTrackObject } from "./Track";

export type SimpleArtistObject = {
  name: string;
  id: string;
  genres: string[];
  href: string;
  image: string;
  popularity: number;
  uri: string;
};

export type SearchedArtistObject = {
  name: string;
  id: string;
  genres: string[];
  href: string;
  image: string;
  popularity: number;
  uri: string;
  connectedArtists: ConnectedArtist[];
};

export type ConnectedArtist = {
  trackName: string;
  artist: SimpleArtistObject;
  image: string;
  sampleTrackURL: string;
  href: string;
};
