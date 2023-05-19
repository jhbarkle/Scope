import { UserProfile } from "../../models/UserProfile";

export interface SpotifyUserResponse {
  country: string;
  display_name: string;
  email: string;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  uri: string;
}

export interface Followers {
  href: null;
  total: number;
}

export interface Image {
  height: null;
  url: string;
  width: null;
}

export const mapToUserProfile = (artist: SpotifyUserResponse): UserProfile => {
  return {
    display_name: artist.display_name,
    email: artist.email,
    followers: artist.followers.total,
    id: artist.id,
    profileImage: artist.images[0].url,
    uri: artist.uri,
    topTracks: {
      shortTerm: [],
      mediumTerm: [],
      longTerm: [],
    },
    topArtists: {
      shortTerm: [],
      mediumTerm: [],
      longTerm: [],
    },
    followedArtists: [],
  };
};
