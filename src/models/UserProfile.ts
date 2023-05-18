import { SimpleArtistObject } from "./Artist";

export type UserProfile = {
  display_name: string;
  email: string;
  followers: number;
  id: string;
  profileImage: string;
  uri: string;
  topAlbums: {
    shortTerm: SimpleArtistObject[];
    mediumTerm: SimpleArtistObject[];
    longTerm: SimpleArtistObject[];
  };
  topArtists: {
    shortTerm: SimpleArtistObject[];
    mediumTerm: SimpleArtistObject[];
    longTerm: SimpleArtistObject[];
  };
  followedArtists: SimpleArtistObject[];
};
