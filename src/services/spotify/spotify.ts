import { baseSpotifyUrl } from ".";
import { SimpleArtistObject } from "../../models/Artist";
import { SimpleTrackObject } from "../../models/Track";
import { UserProfile } from "../../models/UserProfile";
import { checkTokenExpiration, getToken } from "../utils";

export const fetchProfile = async (): Promise<UserProfile> => {
  await checkTokenExpiration();
  const token = getToken();

  const result = await fetch(`${baseSpotifyUrl}/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const jsonResult = await result.json();

  if (!jsonResult?.error) {
    console.log("✅ Fetching Profile was successful");
  } else {
    console.log("❌ Fetching Profile was not successful", jsonResult);
    throw new Error("Fetching Profile was not successful");
  }

  const profile: UserProfile = {
    display_name: jsonResult.display_name,
    email: jsonResult.email,
    followers: jsonResult.followers.total,
    id: jsonResult.id,
    profileImage: jsonResult.images[0].url,
    uri: jsonResult.uri,
    topAlbums: {
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

  return profile;
};

export const fetchFollowedArtists = async (): Promise<SimpleArtistObject[]> => {
  // Aquire token and check if it is expired
  await checkTokenExpiration();
  const token = getToken();

  // Fetch followed artists
  const result = await fetch(
    `${baseSpotifyUrl}/me/following?type=artist&limit=50`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  // Convert result to JSON
  const jsonResult = await result.json();

  // Check if there was an error
  if (!jsonResult?.error) {
    console.log(
      "✅ Fetching Followed Artists for user was successful",
      jsonResult
    );
  } else {
    console.log(
      "❌ Fetching Followed Artists for user was NOT successful",
      jsonResult
    );
    throw new Error("Fetching Followed Artists for user was not successful");
  }

  console.log("Followed Artists Response: ", jsonResult);

  // Check if there are more results to fetch
  let lastIdRetreivedForPagination = jsonResult.artists.next;

  // Store all retreived results
  let allRetreivedResults = jsonResult.artists.items;

  if (!lastIdRetreivedForPagination) {
    console.log("No more Followed Artists to fetch");
  }

  while (lastIdRetreivedForPagination) {
    console.log("Still Retreiving Followed Artists...");

    // Fetch next results
    const nextResult = await fetch(lastIdRetreivedForPagination, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    // Convert next results to JSON
    const nextJsonResult = await nextResult.json();
    console.log("Next JSON Result: ", nextJsonResult);

    // Check if there was an error
    if (!nextJsonResult?.error) {
      console.log(
        "✅ Fetching Followed Artists for user was successful",
        nextJsonResult
      );
    } else {
      console.log(
        "❌ Fetching Followed Artists for user was NOT successful",
        nextJsonResult
      );
      throw new Error("Fetching Followed Artists for user was not successful");
    }

    // Add next results to all retreived results
    allRetreivedResults = [
      ...allRetreivedResults,
      ...nextJsonResult.artists.items,
    ];

    // Check if there are more results to fetch
    lastIdRetreivedForPagination = nextJsonResult.artists.next;
  }

  // Return all retreived results
  // console.log(" 🎤 All Followed Artists: ", allRetreivedResults);

  const followedArtists: SimpleArtistObject[] = allRetreivedResults.map(
    (artist: any) => {
      return {
        id: artist.id,
        name: artist.name,
        uri: artist.uri,
        image: artist.images[0].url,
        href: artist.href,
        popularity: artist.popularity,
        genres: artist.genres,
      };
    }
  );

  return followedArtists;
};

export const fetchTopArtists = async (
  timeRange: "short_term" | "medium_term" | "long_term"
): Promise<SimpleArtistObject[]> => {
  await checkTokenExpiration();
  const token = getToken();

  const result = await fetch(
    `${baseSpotifyUrl}/me/top/artists?time_range=${timeRange}&limit=50`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  // Convert result to JSON
  const jsonResult = await result.json();

  // Check if there was an error
  if (!jsonResult?.error) {
    console.log("✅ Fetching Users Top Artists was successful", jsonResult);
  } else {
    console.log("❌ Fetching Users Top Artists was NOT successful", jsonResult);
    throw new Error("Fetching Users Top Artists was not successful");
  }

  console.log("Users Top Artists Response: ", jsonResult);

  // Check if there are more results to fetch
  let lastIdRetreivedForPagination = jsonResult.next;

  // Store all retreived results
  let allRetreivedResults = jsonResult.items;

  if (!lastIdRetreivedForPagination) {
    console.log("No more Users Top Artists to fetch");
  }

  while (lastIdRetreivedForPagination) {
    console.log("Still Retreiving Users Top Artists...");

    // Fetch next results
    const nextResult = await fetch(lastIdRetreivedForPagination, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    // Convert next results to JSON
    const nextJsonResult = await nextResult.json();
    console.log("Next JSON Result: ", nextJsonResult);

    // Check if there was an error
    if (!nextJsonResult?.error) {
      console.log(
        "✅ Fetching Followed Artists for user was successful",
        nextJsonResult
      );
    } else {
      console.log(
        "❌ Fetching Followed Artists for user was NOT successful",
        nextJsonResult
      );
      throw new Error("Fetching Followed Artists for user was not successful");
    }

    // Add next results to all retreived results
    allRetreivedResults = [...allRetreivedResults, ...nextJsonResult.items];

    // Check if there are more results to fetch
    lastIdRetreivedForPagination = nextJsonResult.next;
  }

  // Return all retreived results
  console.log(" 🎤 All Top Artists: ", allRetreivedResults);

  const topArtists: SimpleArtistObject[] = allRetreivedResults.map(
    (artist: any) => {
      return {
        id: artist.id,
        name: artist.name,
        uri: artist.uri,
        image: artist.images[0].url,
        href: artist.href,
        popularity: artist.popularity,
        genres: artist.genres,
      };
    }
  );

  return topArtists;
};

export const fetchTopTracks = async (
  timeRange: "short_term" | "medium_term" | "long_term"
): Promise<SimpleTrackObject[]> => {
  await checkTokenExpiration();
  const token = getToken();

  const result = await fetch(
    `${baseSpotifyUrl}/me/top/tracks?time_range=${timeRange}&limit=50`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  // Convert result to JSON
  const jsonResult = await result.json();

  // Check if there was an error
  if (!jsonResult?.error) {
    console.log("✅ Fetching Users Top Tracks was successful", jsonResult);
  } else {
    console.log("❌ Fetching Users Top Tracks was NOT successful", jsonResult);
    throw new Error("Fetching Users Top Tracks was not successful");
  }

  console.log("Users Top Tracks Response: ", jsonResult);

  // Check if there are more results to fetch
  let lastIdRetreivedForPagination = jsonResult.next;

  // Store all retreived results
  let allRetreivedResults = jsonResult.items;

  if (!lastIdRetreivedForPagination) {
    console.log("No more Users Top Tracks to fetch");
  }

  while (lastIdRetreivedForPagination) {
    console.log("Still Retreiving Users Top Tracks...");

    // Fetch next results
    const nextResult = await fetch(lastIdRetreivedForPagination, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    // Convert next results to JSON
    const nextJsonResult = await nextResult.json();
    console.log("Next JSON Result: ", nextJsonResult);

    // Check if there was an error
    if (!nextJsonResult?.error) {
      console.log(
        "✅ Fetching Followed Tracks for user was successful",
        nextJsonResult
      );
    } else {
      console.log(
        "❌ Fetching Followed Tracks for user was NOT successful",
        nextJsonResult
      );
      throw new Error("Fetching Followed Tracks for user was not successful");
    }

    // Add next results to all retreived results
    allRetreivedResults = [...allRetreivedResults, ...nextJsonResult.items];

    // Check if there are more results to fetch
    lastIdRetreivedForPagination = nextJsonResult.next;
  }

  // Return all retreived results
  console.log(" 🎤 All Top Tracks: ", allRetreivedResults);

  const topTracks: SimpleTrackObject[] = allRetreivedResults.map(
    (artist: any) => {
      return {
        href: artist.href,
        albumName: artist.album.name,
        albumImage: artist.album.images[0].url,
        trackName: artist.name,
        popularity: artist.popularity,
        previewUrl: artist.preview_url,
        uri: artist.uri,
        id: artist.id,
      };
    }
  );

  return topTracks;
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
