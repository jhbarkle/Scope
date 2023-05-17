import { baseSpotifyUrl } from ".";
import { UserProfile } from "../models/Profile";
import { getToken } from "./utils";

export const fetchProfile = async (): Promise<UserProfile> => {
  const token = getToken();
  const result = await fetch(`${baseSpotifyUrl}/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const jsonResult = await result.json();

  console.log("Profile: ", jsonResult);
  return jsonResult;
};

export const fetchTopArtists = async (
  token: string,
  timeRange: string
): Promise<any> => {
  const result = await fetch(
    `${baseSpotifyUrl}/me/top/artists?time_range=${timeRange}&limit=50`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await result.json();
};

export const fetchTopTracks = async (
  token: string,
  timeRange: string
): Promise<any> => {
  const result = await fetch(
    `${baseSpotifyUrl}/me/top/tracks?time_range=${timeRange}&limit=50`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await result.json();
};

export const fetchFollowedArtists = async (token: string): Promise<any> => {
  const result = await fetch(`${baseSpotifyUrl}/me/following?type=artist`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return await result.json();
};

export const search = async (token: string, artist: string): Promise<any> => {
  const result = await fetch(
    `${baseSpotifyUrl}/search?q=${artist}&type=artist&limit=1`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await result.json();
};

export const fetchArtist = async (
  token: string,
  artistId: string
): Promise<any> => {
  const result = await fetch(`${baseSpotifyUrl}/artists/${artistId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return await result.json();
};

export const fetchArtistAlbums = async (
  token: string,
  artistId: string
): Promise<any> => {
  const result = await fetch(
    `${baseSpotifyUrl}/artists/${artistId}/albums?include_groups=single%2C+album&limit=50
    `,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await result.json();
};

export const fetchConnectedArtists = async (
  token: string,
  artistId: string
): Promise<any> => {
  const result = await fetch(
    `${baseSpotifyUrl}/artists/${artistId}/albums?include_groups=appears_on&limit=50
    `,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await result.json();
};

export const fetchConnectedArtistsAlbums = async (
  token: string,
  albumIds: string[]
): Promise<any> => {
  const result = await fetch(
    `${baseSpotifyUrl}/albums/?ids=${albumIds.join(",")}
    `,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await result.json();
};

export const fetchArtistTopTracks = async (
  token: string,
  artistId: string
): Promise<any> => {
  const result = await fetch(
    `${baseSpotifyUrl}/artists/${artistId}/top-tracks
    `,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await result.json();
};

export const fetchRelatedArtists = async (
  token: string,
  artistId: string
): Promise<any> => {
  const result = await fetch(
    `${baseSpotifyUrl}/artists/${artistId}/related-artists
    `,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await result.json();
};

// PUT API Calls
export const unFollowArtist = async (
  token: string,
  artistId: string
): Promise<any> => {
  const result = await fetch(`${baseSpotifyUrl}/me/following`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      ids: [artistId],
    }),
  });
  return await result.json();
};

export const followArtist = async (
  token: string,
  artistId: string
): Promise<any> => {
  const result = await fetch(`${baseSpotifyUrl}/me/following`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      ids: [artistId],
    }),
  });
  return await result.json();
};

export const createPlaylist = async (
  token: string,
  name: string,
  description: string,
  isPublic: boolean,
  userId: string
): Promise<any> => {
  const result = await fetch(`${baseSpotifyUrl}/users/${userId}/playlists`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      name: name,
      description: description,
      public: isPublic,
    }),
  });

  // need to get spotify id of playlist
  return await result.json();
};

export const addItemsToPlaylist = async (
  token: string,
  playlistId: string,
  uris: string[]
): Promise<any> => {
  const result = await fetch(
    `${baseSpotifyUrl}/playlists/${playlistId}/tracks`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        uris: uris,
      }),
    }
  );

  // need to get spotify id of playlist
  return await result.json();
};
