export type Profile = {
  display_name: string;
  email: string;
  href: string;
};

export type SimpleArtistObject = {
  name: string;
  id: string;
  followers: number;
  genres: string[];
  href: string;
  image: string;
  popularity: number;
  uri: string;
};

export type SimpleAlbumObject = {
  albumType: string;
  totalTracks: number;
  id: string;
  image: string;
  name: string;
  releaseDate: string;
  uri: string;
  genres: string[];
  label: string;
  popularity: number;
  artists: SimpleArtistObject[];
};

export type SimpleTrackObject = {
  album: SimpleAlbumObject;
  artists: SimpleArtistObject[];
  explicit: boolean;
  href: string;
  id: string;
  name: string;
  popularity: number;
  previewUrl: string | null;
  uri: string;
};

export type UserProfile = {
  display_name: string;
  email: string;
  followers: number;
  id: string;
  profileImage: string;
  uri: string;
  topAlbums: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
  };
  topArtists: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
  };
  followedArtists: SimpleArtistObject[];
};

export type ConnectedArtist = {
  track: SimpleTrackObject;
  artist: SimpleArtistObject;
  image: string;
  sampleTrackURL: string;
  href: string;
};

export type SearchState = {
  isLoading: boolean;
  artist: SimpleArtistObject;
  connectedArtists: SimpleArtistObject[];
  searchHistory: string[];
};
