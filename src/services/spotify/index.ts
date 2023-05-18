export const CLIENT_ID = "20e76801c41c40b8a1fb1fa67c8d05ac";
export const redirect_uri = "http://localhost:5174/home";
export const baseSpotifyUrl = "https://api.spotify.com/v1";

export const scopes =
  "user-read-private user-read-email user-top-read user-follow-modify user-follow-read";
export const params = new URLSearchParams(window.location.search);
export const code = params.get("code");
