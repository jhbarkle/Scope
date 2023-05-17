import { UserProfile } from "../models/Profile";

export const CLIENT_ID = "20e76801c41c40b8a1fb1fa67c8d05ac";
export const redirect_uri = "http://localhost:5174/home";
const baseSpotifyUrl = "https://api.spotify.com/v1";
const scopes =
  "user-read-private user-read-email user-top-read user-follow-modify";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

export const authorizeAndGatherUserData = async () => {
  if (!code) {
    console.log("Authorizing...");

    // Clear Display Name
    localStorage.removeItem("display_name");
    redirectToAuthCodeFlow(CLIENT_ID);
  } else {
    const data = localStorage.getItem("tokenExpiresIn");
    if (!data) {
      console.log("Gathering Access Token & Profile Data...");
      const accessToken = await getAccessToken(CLIENT_ID, code);
      // const profile = await fetchProfile(accessToken);
    } else {
      console.log("User data already gathered.");
    }
  }
};

// Set the API token with a timestamp in localStorage
function setAPIToken(token: string) {
  console.log("Setting API Token...");
  const timestamp = new Date().getTime();
  const data = { token, timestamp };
  localStorage.setItem("tokenExpiresIn", JSON.stringify(data));
}

const getToken = (): string => {
  const data = localStorage.getItem("tokenExpiresIn");
  if (data) {
    const { token } = JSON.parse(data);
    return token;
  }
  return "";
};

// Check if 60 minutes have passed since the token was set
export const isTokenExpired = () => {
  const data = localStorage.getItem("tokenExpiresIn");
  if (data) {
    const { timestamp } = JSON.parse(data);
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - timestamp;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60)); // Convert milliseconds to minutes

    return minutesDifference >= 60;
  }
  return true; // Return true if the token is not found in localStorage
};

export const redirectToAuthCodeFlow = async (clientId: string) => {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", redirect_uri);
  params.append("scope", scopes);
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

const generateCodeVerifier = (length: number) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const generateCodeChallenge = async (codeVerifier: string) => {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const getAccessToken = async (
  clientId: string,
  code: string
): Promise<string> => {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirect_uri);
  // We are 100% sure this value will be in localStorage
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  params.append("code_verifier", verifier!);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const { access_token, refresh_token } = await result.json();
  localStorage.setItem("refresh_token", refresh_token);
  setAPIToken(access_token);

  return access_token;
};

const refreshToken = async () => {
  try {
    const current_refresh_token = localStorage.getItem("refresh_token");
    const current_token = getToken();
    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", current_refresh_token ?? "");

    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${current_token}`,
      },
      body: params,
    });

    //VERIFY WE GET A NEW REFRESH TOKEN BACK

    // Handle the response and extract the new token
    const { access_token, refresh_token } = await result.json();
    console.log("New Access Token:", access_token);
    console.log("Refresh Token", refresh_token);

    setAPIToken(access_token);

    // Perform any necessary actions with the new token
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
};

type CallbackFunction<T> = (...args: unknown[]) => T;

export async function makeAPIRequest<T>(call: CallbackFunction<T>) {
  if (isTokenExpired()) {
    // Get Refresh Token
    console.log("Token has expired, refreshing...");
    await refreshToken();
    console.log("Token refreshed.");
  }
  return await call();
}

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

async function fetchTopArtists(token: string, timeRange: string): Promise<any> {
  const result = await fetch(
    `${baseSpotifyUrl}/me/top/artists?time_range=${timeRange}&limit=50`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await result.json();
}

async function fetchTopTracks(token: string, timeRange: string): Promise<any> {
  const result = await fetch(
    `${baseSpotifyUrl}/me/top/tracks?time_range=${timeRange}&limit=50`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await result.json();
}

async function fetchFollowedArtists(token: string): Promise<any> {
  const result = await fetch(`${baseSpotifyUrl}/me/following?type=artist`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return await result.json();
}

async function search(token: string, artist: string): Promise<any> {
  const result = await fetch(
    `${baseSpotifyUrl}/search?q=${artist}&type=artist&limit=1`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await result.json();
}

async function fetchArtist(token: string, artistId: string): Promise<any> {
  const result = await fetch(`${baseSpotifyUrl}/artists/${artistId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return await result.json();
}

async function fetchArtistAlbums(
  token: string,
  artistId: string
): Promise<any> {
  const result = await fetch(
    `${baseSpotifyUrl}/artists/${artistId}/albums?include_groups=single%2C+album&limit=50
    `,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await result.json();
}

async function fetchConnectedArtists(
  token: string,
  artistId: string
): Promise<any> {
  const result = await fetch(
    `${baseSpotifyUrl}/artists/${artistId}/albums?include_groups=appears_on&limit=50
    `,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await result.json();
}

async function fetchConnectedArtistsAlbums(
  token: string,
  albumIds: string[]
): Promise<any> {
  const result = await fetch(
    `${baseSpotifyUrl}/albums/?ids=${albumIds.join(",")}
    `,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await result.json();
}

async function fetchArtistTopTracks(
  token: string,
  artistId: string
): Promise<any> {
  const result = await fetch(
    `${baseSpotifyUrl}/artists/${artistId}/top-tracks
    `,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await result.json();
}

async function fetchRelatedArtists(
  token: string,
  artistId: string
): Promise<any> {
  const result = await fetch(
    `${baseSpotifyUrl}/artists/${artistId}/related-artists
    `,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await result.json();
}

// PUT API Calls
async function unFollowArtist(token: string, artistId: string): Promise<any> {
  const result = await fetch(`${baseSpotifyUrl}/me/following`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      ids: [artistId],
    }),
  });
  return await result.json();
}

async function followArtist(token: string, artistId: string): Promise<any> {
  const result = await fetch(`${baseSpotifyUrl}/me/following`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      ids: [artistId],
    }),
  });
  return await result.json();
}

async function createPlaylist(
  token: string,
  name: string,
  description: string,
  isPublic: boolean,
  userId: string
): Promise<any> {
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
}

async function addItemsToPlaylist(
  token: string,
  playlistId: string,
  uris: string[]
): Promise<any> {
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
}
