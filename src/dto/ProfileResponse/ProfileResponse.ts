import { UserProfile } from "../../models/UserProfile";
import { ExternalUrls, Followers, Image } from "../Shared/Shared";

export interface SpotifyUserResponse {
  country: string;
  display_name: string;
  email: string;
  followers: Followers;
  href: string;
  external_urls: ExternalUrls;
  id: string;
  images: Image[];
  uri: string;
}

export const mapToUserProfile = (artist: SpotifyUserResponse): UserProfile => {
  return {
    displayName: artist.display_name,
    email: artist.email,
    followers: artist.followers.total,
    href: artist.href,
    id: artist.id,
    profileImage: artist.images[0].url,
    uri: artist.uri,
    spotifyProfileUrl: artist.external_urls.spotify,
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
