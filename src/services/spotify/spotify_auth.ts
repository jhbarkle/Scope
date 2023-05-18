import { code, CLIENT_ID, redirect_uri, scopes } from "../spotify";
import {
  generateCodeChallenge,
  generateCodeVerifier,
  getToken,
  setAPIToken,
} from "../utils";

// Either redirect to Spotify for Authorization or gather the
// user's data depending on if the user has already authorized the app
export const authorizeAndGatherUserData = async () => {
  if (!code) {
    console.log("Redirecting to Spotify for Authorization...");
    console.log("Clearing Local Storage...");
    localStorage.clear();
    redirectToAuthCodeFlow(CLIENT_ID);
  } else {
    const data = localStorage.getItem("tokenObject");
    // Check if we have already generated an access token
    if (!data) {
      console.log("Token has not been gathered yet.");
      console.log("Gathering Access Token...");
      await getAccessToken(CLIENT_ID, code);
      console.log("Access Token has been gathered.");
    } else {
      console.log("User Data and Access Token already gathered.");
    }
  }
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
  console.log("Access token after first getting it: ", access_token);
  localStorage.setItem("refresh_token", refresh_token);

  // setTimeout(setAPIToken, 5000, access_token);
  setAPIToken(access_token);

  return access_token;
};

export const refreshToken = async () => {
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
