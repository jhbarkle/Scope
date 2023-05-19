export interface TopArtistsResponse {
  href: string;
  next: string;
  total: number;
  items: Artist[];
}

export interface Artist {
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  uri: string;
}

export interface Image {
  url: string;
  height: number;
  width: number;
}
