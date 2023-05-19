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

export type ConnectedArtist = {
  track: SimpleTrackObject;
  artist: SimpleArtistObject;
  image: string;
  sampleTrackURL: string;
  href: string;
};
