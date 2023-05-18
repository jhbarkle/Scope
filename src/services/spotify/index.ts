import { refreshToken } from "./spotify_auth";
import { isTokenExpired } from "../utils";

export const CLIENT_ID = "20e76801c41c40b8a1fb1fa67c8d05ac";
export const redirect_uri = "http://localhost:5174/home";
export const baseSpotifyUrl = "https://api.spotify.com/v1";

export const scopes =
  "user-read-private user-read-email user-top-read user-follow-modify";
export const params = new URLSearchParams(window.location.search);
export const code = params.get("code");

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
