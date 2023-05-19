import { SimpleArtistObject } from "../../models/Artist";
import { Artist } from "../Shared/Shared";

export interface SearchResponse {
  artists: Artists;
}

export interface Artists {
  items: Artist[];
  total: number;
}

export const mapToSingleSimpleArtistObject = (
  artist: Artist
): SimpleArtistObject => {
  return {
    id: artist.id,
    name: artist.name,
    uri: artist.uri,
    image: artist.images[0].url,
    href: artist.href,
    popularity: artist.popularity,
    genres: artist.genres,
  };
};
