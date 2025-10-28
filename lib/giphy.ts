import fetch from "node-fetch";

const ENDPOINT = "https://api.giphy.com/v1/gifs/search";
const API_KEY = "INSERT_API_KEY";
const RAITING = "r";

export const getGif = async (searchTerms: string) => {
  const url = new URL(ENDPOINT);
  url.searchParams.append("api_key", API_KEY);
  url.searchParams.append("q", searchTerms);
  url.searchParams.append("rating", RAITING);

  const response = await fetch(url.toString());
  return response.json();
};
