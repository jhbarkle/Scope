import { Connect } from "vite";
import { baseSpotifyUrl } from ".";
import {
  ArtistAlbumsResponse,
  Item,
} from "../../dto/ArtistAlbumsResponse/ArtistAlbumsResponse";
import { ArtistTrackResponse } from "../../dto/ArtistTrackResponse";
import {
  FollowedArtistResponse,
  mapToSimpleArtistObject,
} from "../../dto/FollowedArtistResponse/FollowedArtistResponse";
import {
  GetSeveralAlbumsResponse,
  mapAlbumsToConnectedArtists,
} from "../../dto/GetSeveralAlbumsResponse/GetSeveralAlbumsResponse";
import {
  SpotifyUserResponse,
  mapToUserProfile,
} from "../../dto/ProfileResponse/ProfileResponse";
import {
  SearchResponse,
  mapToSingleSimpleArtistObject,
} from "../../dto/SearchResponse/SearchResponse";
import { Artist } from "../../dto/Shared/Shared";
import { TopArtistsResponse } from "../../dto/TopArtistsResponse/TopArtistsResponse";
import {
  TopTrackResponse,
  Track,
  mapToSimpleTrackObject,
} from "../../dto/TopTracksResponse/TopTracksResponse";
import {
  ConnectedArtist,
  ConnectedArtistObject,
  SimpleArtistObject,
} from "../../models/Artist";
import { SimpleTrackObject } from "../../models/Track";
import { UserProfile } from "../../models/UserProfile";
import { get } from "./network";

export const fetchProfile = async (): Promise<UserProfile> => {
  console.log(" ➡️ Fetching profile data...");

  // Fetch profile data
  const result = await get<SpotifyUserResponse>(`${baseSpotifyUrl}/me`);

  // Map Response to UserProfile
  const profile: UserProfile = mapToUserProfile(result);

  console.log(" ✅ Fetching profile data was successful, returning profile");

  return profile;
};

export const fetchFollowedArtists = async (): Promise<SimpleArtistObject[]> => {
  // Fetch first results

  console.log(" ➡️ Fetching Followed Artists...");

  const result = await get<FollowedArtistResponse>(
    `${baseSpotifyUrl}/me/following?type=artist&limit=50`
  );

  // Check if there are more results to fetch
  let lastIdRetreivedForPagination = result.artists.next;

  // Store all retreived results
  let allRetreivedResults: Artist[] = result.artists.items;

  // Paginate through all results
  while (lastIdRetreivedForPagination) {
    console.log("Still Retreiving Followed Artists...");

    // Fetch next results
    const result = await get<FollowedArtistResponse>(
      lastIdRetreivedForPagination
    );

    // Add next results to all retreived results
    allRetreivedResults = [...allRetreivedResults, ...result.artists.items];

    // Check if there are more results to fetch
    lastIdRetreivedForPagination = result.artists.next;
  }

  console.log(
    " ✅ Fetching Followed Artists was successful, returning followed artists"
  );

  console.log("results my man", allRetreivedResults);

  // Return all retreived results as SimpleArtistObjects
  return mapToSimpleArtistObject(allRetreivedResults);
};

export const fetchTopArtists = async (
  timeRange: "short_term" | "medium_term" | "long_term"
): Promise<SimpleArtistObject[]> => {
  // Fetch first results

  console.log(" ➡️ Fetching Top Artists...");
  const result = await get<TopArtistsResponse>(
    `${baseSpotifyUrl}/me/top/artists?time_range=${timeRange}&limit=50`
  );

  // Check if there are more results to fetch
  let lastIdRetreivedForPagination = result.next;

  // Store all retreived results
  let allRetreivedResults: Artist[] = result.items;

  // Paginate through all results
  while (lastIdRetreivedForPagination) {
    console.log("Still Retreiving Top Artists...");

    // Fetch next results
    const result = await get<TopArtistsResponse>(lastIdRetreivedForPagination);

    // Add next results to all retreived results
    allRetreivedResults = [...allRetreivedResults, ...result.items];

    // Check if there are more results to fetch
    lastIdRetreivedForPagination = result.next;
  }

  console.log(" ✅ Fetching Top Artists was successful, returning artists");

  // Return all retreived results as SimpleArtistObjects
  return mapToSimpleArtistObject(allRetreivedResults);
};

export const fetchTopTracks = async (
  timeRange: "short_term" | "medium_term" | "long_term"
): Promise<SimpleTrackObject[]> => {
  console.log(" ➡️ Fetching Top Tracks...");
  // Fetch first results
  const result = await get<TopTrackResponse>(
    `${baseSpotifyUrl}/me/top/tracks?time_range=${timeRange}&limit=50`
  );

  // Check if there are more results to fetch
  let lastIdRetreivedForPagination = result.next;

  // Store all retreived results
  let allRetreivedResults: Track[] = result.items;

  // Paginate through all results
  while (lastIdRetreivedForPagination) {
    console.log("Still Retreiving Top Tracks...");

    // Fetch next results
    const result = await get<TopTrackResponse>(lastIdRetreivedForPagination);

    // Add next results to all retreived results
    allRetreivedResults = [...allRetreivedResults, ...result.items];

    // Check if there are more results to fetch
    lastIdRetreivedForPagination = result.next;
  }

  console.log(" ✅ Fetching Top Tracks was successful, returning tracks");

  // Return all retreived results as SimpleArtistObjects
  return mapToSimpleTrackObject(allRetreivedResults);
};

export const search = async (artist: string): Promise<SimpleArtistObject> => {
  console.log(` 🔍 Searching for ${artist}...`);

  // Fetch profile data
  const result = await get<SearchResponse>(
    `${baseSpotifyUrl}/search?q=${artist}&type=artist&limit=1`
  );

  const resultArtist = result.artists.items[0];

  if (!resultArtist) {
    throw new Error("No artist found");
  }

  // Map Response to SimpleArtistObject
  const returnedArtist: SimpleArtistObject =
    mapToSingleSimpleArtistObject(resultArtist);

  return returnedArtist;
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

export const filterAlbums = (items: Item[]): Item[] => {
  const filteredAlbums = items.filter((item) => item.album_type === "single");
  const itemsWithoutSingles = items.filter(
    (item) => item.album_type !== "single"
  );
  const filteredSingleAlbumsWithMultipleArtists = filteredAlbums.filter(
    (single) => single.artists.length > 1
  );

  return [...itemsWithoutSingles, ...filteredSingleAlbumsWithMultipleArtists];
};

export const getAppearances = (items: Item[]): Item[] => {
  return items.filter((item) => item.album_group === "appears_on");
};

export const fetchArtistAlbums = async (artistId: string): Promise<Item[]> => {
  console.log(` 🔍 Searching for Searched Artist's Albums...`);

  // Fetch profile data
  const result = await get<ArtistAlbumsResponse>(
    `${baseSpotifyUrl}/artists/${artistId}/albums?limit=50`
  );

  // Check if there are more results to fetch
  let lastIdRetreivedForPagination = result.next;

  // Store all retreived results
  let allRetreivedResults: Item[] = result.items;

  // Paginate through all results
  while (lastIdRetreivedForPagination) {
    console.log("Still Retreiving Albums From Artist...");

    // Fetch next results
    const result = await get<ArtistAlbumsResponse>(
      lastIdRetreivedForPagination
    );

    // Add next results to all retreived results
    allRetreivedResults = [...allRetreivedResults, ...result.items];

    // Check if there are more results to fetch
    lastIdRetreivedForPagination = result.next;
  }
  const filteredAlbums = filterAlbums(allRetreivedResults);
  // console.log("All Appears On Albums", getAppearances(allRetreivedResults));
  // console.log("Full Albums from artist", allRetreivedResults);
  // console.log("Filtered Albums from artist", filteredAlbums);

  // // Map Response to SimpleArtistObject
  // const returnedArtist: SimpleArtistObject =
  //   mapToSingleSimpleArtistObject(resultArtist);

  // return returnedArtist;
  return filteredAlbums;
};

// Not used
export const fetchTracksFromArtistAlbums = async (
  albumIds: string[]
): Promise<any> => {
  let albumTracks: any[] = [];

  for (let i = 0; i < albumIds.length; i++) {
    const result = await get<ArtistTrackResponse>(
      `${baseSpotifyUrl}/albums/${albumIds[i]}/tracks?limit=50`
    );

    // Check if there are more results to fetch
    let lastIdRetreivedForPagination = result.next;

    // Store all retreived results
    // let allRetreivedResults: any[] = result.items;

    // Paginate through all results
    while (lastIdRetreivedForPagination) {
      console.log("Still Retreiving All Tracks From Artist...");

      // Fetch next results
      const result = await get<ArtistAlbumsResponse>(
        lastIdRetreivedForPagination
      );

      // // Add next results to all retreived results
      // allRetreivedResults = [...allRetreivedResults, ...result.items];

      albumTracks = [...albumTracks, ...result.items];

      // Check if there are more results to fetch
      lastIdRetreivedForPagination = result.next;
    }

    albumTracks.push(result.items);
  }

  console.log("Finished Fetching All Tracks From Artist...", albumTracks);

  return "";
};

export const createConnectedArtists = async (
  items: ConnectedArtistObject[]
) => {
  return items.filter((item) => item.tracks.items.map.length > 0);
};

export const fetchAlbums = async (
  albumIds: string[]
): Promise<ConnectedArtistObject[]> => {
  // Variable to keep track of the starting index
  let startIndex = 0;
  let allAlbums: any[] = [];

  // Loop until the startIndex reaches the end of the array
  while (startIndex < albumIds.length) {
    // Get the next 20 elements using array slicing
    const nextElements = albumIds.slice(startIndex, startIndex + 20 - 1);

    // Do something with the nextElements
    console.log(nextElements);

    const url = `${baseSpotifyUrl}/albums?ids=${nextElements.join(",")}`;

    // Fetch profile data
    const result = await get<GetSeveralAlbumsResponse>(
      `${baseSpotifyUrl}/albums?ids=${nextElements.join(",")}`
    );

    allAlbums = [...allAlbums, ...result.albums];

    // Update the startIndex for the next iteration
    startIndex += 20;
  }

  const obn = mapAlbumsToConnectedArtists(allAlbums);
  createConnectedArtists(obn);

  console.log("All Albums", obn);

  return obn;
};

// =============================================== NOT USED ===================================================
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
