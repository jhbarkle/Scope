import { refreshToken } from "./spotify/spotify_auth";

type EnvVariables =
  | "VITE_CLIENT_ID"
  | "VITE_REDIRECT_URI"
  | "VITE_SPOTIFY_BASE_URL";

export const getEnvVariableSafely = (variable: EnvVariables) => {
  const value = process.env[variable];
  if (!value) {
    throw new Error(`Missing environment variable: ${variable}`);
  }
  return value;
};

// Set the API token with a timestamp in localStorage
export const setAPIToken = (token: string) => {
  console.log("Setting API Token...");
  const timestamp = new Date().getTime();
  const data = { token, timestamp };
  localStorage.setItem("tokenObject", JSON.stringify(data));
};

export const getToken = (): string => {
  const data = localStorage.getItem("tokenObject");
  if (data) {
    const { token } = JSON.parse(data);
    return token;
  }
  return "";
};

// Check if 60 minutes have passed since the token was set
export const isTokenExpired = () => {
  const data = localStorage.getItem("tokenObject");
  if (data) {
    const { timestamp } = JSON.parse(data);
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - timestamp;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60)); // Convert milliseconds to minutes

    return minutesDifference >= 60;
  } else {
    console.log("Token not found in localStorage.");
  }
  return true; // Return true if the token is not found in localStorage
};

export const generateCodeVerifier = (length: number) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const generateCodeChallenge = async (codeVerifier: string) => {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const checkTokenExpiration = async () => {
  if (isTokenExpired()) {
    // Get Refresh Token
    console.log(" ⭐️ Token has expired, refreshing...");
    await refreshToken();
    console.log(" ⭐️ Token refreshed.");
  }
};
