import { API_KEY } from ".";

export const getArtistBio = async (artistName: string) => {
  const result = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=${API_KEY}&format=json`
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Request failed");
    })
    .catch((error) => {
      console.log(error);
    });

  console.log("Result: ", result);

  return await result.json();
};
