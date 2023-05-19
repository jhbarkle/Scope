export type SimpleTrackObject = {
  albumName: string;
  image: string;
  href: string;
  id: string;
  name: string;
  popularity: number;
  previewUrl: string | null;
  uri: string;
  artistName: string;
};

export type ConnectedTrack = {
  name: string;
  artists: string[];
  image: string[];
  previewUrl: string;
};
