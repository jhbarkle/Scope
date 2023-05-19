import { SimpleArtistObject } from "./Artist";
import { SimpleTrackObject } from "./Track";

export type UserProfile = {
  displayName: string;
  email: string;
  followers: number;
  id: string;
  profileImage: string;
  spotifyProfileUrl: string;
  href: string;
  uri: string;
  topTracks: {
    shortTerm: SimpleTrackObject[];
    mediumTerm: SimpleTrackObject[];
    longTerm: SimpleTrackObject[];
  };
  topArtists: {
    shortTerm: SimpleArtistObject[];
    mediumTerm: SimpleArtistObject[];
    longTerm: SimpleArtistObject[];
  };
  followedArtists: SimpleArtistObject[];
};
