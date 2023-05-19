import { SimpleTrackObject } from "../../models/Track";

export interface TopTrackResponse {
  items: Track[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string;
  previous: null;
}

export interface Track {
  album: Album;
  artists: Artist[];
  href: string;
  id: string;
  name: string;
  popularity: number;
  preview_url: string;
  uri: string;
}

export interface Album {
  images: Image[];
  name: string;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface Artist {
  name: string;
}

export const mapToSimpleTrackObject = (
  artists: Track[]
): SimpleTrackObject[] => {
  const followedArtists: SimpleTrackObject[] = artists.map((track: Track) => {
    return {
      id: track.id,
      name: track.name,
      uri: track.uri,
      image: track.album.images[0].url,
      albumName: track.album.name,
      href: track.href,
      popularity: track.popularity,
      previewUrl: track.preview_url,
      artistName: track.artists[0].name,
    };
  });

  return followedArtists;
};
