import { Tracks } from "../dto/GetSeveralAlbumsResponse/GetSeveralAlbumsResponse";
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
  connectedArtists: ConnectedArtistObject[];
};

export type ConnectedArtistObject = {
  trackName: string;
  artists: BaseArtist[];
  id: string;
  image: string;
  sampleTrackURL: string;
  href: string;
  tracks: Tracks;
};

export type BaseArtist = {
  name: string;
  image: string;
  id: string;
  href: string;
};

export type ConnectedArtist = {
  artistName: string;
  artistImage: string;
  artistID: string;
  connectedTracks: ConnectedArtist[];
};

export type ConnectedTrack = {
  trackName: string;
  previewURL: string;
};
