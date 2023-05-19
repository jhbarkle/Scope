import { baseSpotifyUrl } from ".";
import {
  Artist,
  FollowedArtistResponse,
  mapToSimpleArtistObject,
} from "../../dto/FollowedArtistResponse/FollowedArtistResponse";
import {
  SpotifyUserResponse,
  mapToUserProfile,
} from "../../dto/ProfileResponse/ProfileResponse";
import { TopArtistsResponse } from "../../dto/TopArtistsResponse/TopArtistsResponse";
import {
  TopTrackResponse,
  Track,
  mapToSimpleTrackObject,
} from "../../dto/TopTracksResponse/TopTracksResponse";
import { SimpleArtistObject } from "../../models/Artist";
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
    " ✅ Fetching Followed Artists was successful, returning artists"
  );

  // Return all retreived results as SimpleArtistObjects
  return mapToSimpleArtistObject(allRetreivedResults);

  // Aquire token and check if it is expired
  // await checkTokenExpiration();
  // const token = getToken();

  // // Fetch followed artists
  // const result = await fetch(
  //   `${baseSpotifyUrl}/me/following?type=artist&limit=50`,
  //   {
  //     method: "GET",
  //     headers: { Authorization: `Bearer ${token}` },
  //   }
  // );

  // // Convert result to JSON
  // const jsonResult = await result.json();

  // // Check if there was an error
  // if (!jsonResult?.error) {
  //   console.log(
  //     "✅ Fetching Followed Artists for user was successful",
  //     jsonResult
  //   );
  // } else {
  //   console.log(
  //     "❌ Fetching Followed Artists for user was NOT successful",
  //     jsonResult
  //   );
  //   throw new Error("Fetching Followed Artists for user was not successful");
  // }

  // console.log("Followed Artists Response: ", jsonResult);

  // // Check if there are more results to fetch
  // let lastIdRetreivedForPagination = jsonResult.artists.next;

  // // Store all retreived results
  // let allRetreivedResults = jsonResult.artists.items;

  // if (!lastIdRetreivedForPagination) {
  //   console.log("No more Followed Artists to fetch");
  // }

  // while (lastIdRetreivedForPagination) {
  //   console.log("Still Retreiving Followed Artists...");

  //   // Fetch next results
  //   const nextResult = await fetch(lastIdRetreivedForPagination, {
  //     method: "GET",
  //     headers: { Authorization: `Bearer ${token}` },
  //   });

  //   // Convert next results to JSON
  //   const nextJsonResult = await nextResult.json();
  //   console.log("Next JSON Result: ", nextJsonResult);

  //   // Check if there was an error
  //   if (!nextJsonResult?.error) {
  //     console.log(
  //       "✅ Fetching Followed Artists for user was successful",
  //       nextJsonResult
  //     );
  //   } else {
  //     console.log(
  //       "❌ Fetching Followed Artists for user was NOT successful",
  //       nextJsonResult
  //     );
  //     throw new Error("Fetching Followed Artists for user was not successful");
  //   }

  //   // Add next results to all retreived results
  //   allRetreivedResults = [
  //     ...allRetreivedResults,
  //     ...nextJsonResult.artists.items,
  //   ];

  //   // Check if there are more results to fetch
  //   lastIdRetreivedForPagination = nextJsonResult.artists.next;
  // }

  // // Return all retreived results
  // // console.log(" 🎤 All Followed Artists: ", allRetreivedResults);

  // const followedArtists: SimpleArtistObject[] = allRetreivedResults.map(
  //   (artist: any) => {
  //     return {
  //       id: artist.id,
  //       name: artist.name,
  //       uri: artist.uri,
  //       image: artist.images[0].url,
  //       href: artist.href,
  //       popularity: artist.popularity,
  //       genres: artist.genres,
  //     };
  //   }
  // );

  // return followedArtists;
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
