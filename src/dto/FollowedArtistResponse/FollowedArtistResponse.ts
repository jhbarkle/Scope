import { SimpleArtistObject } from "../../models/Artist";
import { Artist } from "../Shared/Shared";

export interface FollowedArtistResponse {
  artists: Artists;
}

export interface Artists {
  href: string;
  next: string;
  total: number;
  items: Artist[];
}

export const mapToSimpleArtistObject = (
  artists: Artist[]
): SimpleArtistObject[] => {
  const followedArtists: SimpleArtistObject[] = artists.map(
    (artist: Artist) => {
      return {
        id: artist.id,
        name: artist.name,
        uri: artist.uri,
        image: artist.images[0]?.url ?? "/icons/default-profile-image.png",
        href: artist.href,
        popularity: artist.popularity,
        genres: artist.genres,
      };
    }
  );

  return followedArtists;
};
