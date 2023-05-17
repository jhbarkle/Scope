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

export async function redirectToAuthCodeFlow(clientId: string) {
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
}

function generateCodeVerifier(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function getAccessToken(
  clientId: string,
  code: string
): Promise<string> {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirect_uri);
  params.append("code_verifier", verifier!);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const { access_token } = await result.json();
  // localStorage.setItem("token", access_token);
  setAPIToken(access_token);

  return access_token;
}

type SimpleArtistObject = {
  name: string;
  id: string;
  followers: number;
  genres: string[];
  href: string;
  image: string;
  popularity: number;
  uri: string;
};

type SimpleAlbumObject = {
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

type SimpleTrackObject = {
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

type Profile = {
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

type ConnectedArtist = {
  track: SimpleTrackObject;
  artist: SimpleArtistObject;
  image: string;
  sampleTrackURL: string;
  href: string;
};

type SearchState = {
  isLoading: boolean;
  artist: SimpleArtistObject;
  connectedArtists: SimpleArtistObject[];
  searchHistory: string[];
};

async function fetchProfile(token: string): Promise<any> {
  const result = await fetch(`${baseSpotifyUrl}/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return await result.json();
}

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
