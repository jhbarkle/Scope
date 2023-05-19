import { checkTokenExpiration, getToken } from "../utils";

export async function requestManager<T>(
  path: string,
  config: RequestInit
): Promise<T> {
  // Check if the token is expired
  await checkTokenExpiration();

  // Get the token from localStorage
  const token = getToken();

  // Add the token to the Authorization header
  const initConfig = {
    headers: { Authorization: `Bearer ${token}` },
    ...config,
  };

  // Make the request and fetch the response
  const request = new Request(path, initConfig);
  const response = await fetch(request);

  // Check if the response is ok
  if (!response.ok) {
    console.log("❌ Fetching was not successful ❌", response);
    throw new Error("Fetching was not successful");
  }

  // may error if there is no body, return empty object
  return response.json().catch(() => ({}));
}

export async function get<T>(path: string, config?: RequestInit): Promise<T> {
  const init = { method: "GET", ...config };
  return await requestManager<T>(path, init);
}

export async function post<T, U>(
  path: string,
  body: T,
  config?: RequestInit
): Promise<U> {
  const init = { method: "POST", body: JSON.stringify(body), ...config };
  return await requestManager<U>(path, init);
}

export async function put<T, U>(
  path: string,
  body: T,
  config?: RequestInit
): Promise<U> {
  const init = { method: "PUT", body: JSON.stringify(body), ...config };
  return await requestManager<U>(path, init);
}
