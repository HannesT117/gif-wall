// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { getRandomInt } from "../../lib/random-int";

type Data = any;

const ENDPOINT = "https://api.giphy.com/v1/gifs/search";
const API_KEY = process.env.API_KEY;
const RATING = process.env.RATING || "pg";
const API_LIMIT = Number(process.env.API_LIMIT) || 50;

const request = async (url: URL) => {
  const response = await fetch(url.toString());
  const { data } = (await response.json()) as any;

  return data;
};

const getOffset = (pageSize: number) => {
  return getRandomInt(10) * pageSize;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!API_KEY) {
    throw Error("API Key for giphy has to be defined.");
  }

  const searchTerms = req.query.q as string;
  const clientRating = req.query.rating as string;

  // Validate rating is one of: g, pg, pg-13, r
  const validRatings = ["g", "pg", "pg-13", "r"];
  const safeRating =
    clientRating && validRatings.includes(clientRating) ? clientRating : RATING;

  const url = new URL(ENDPOINT);
  url.searchParams.append("api_key", API_KEY);
  url.searchParams.append("q", searchTerms);
  url.searchParams.append("rating", safeRating);
  url.searchParams.append("limit", `${API_LIMIT}`);
  url.searchParams.append("offset", `${getOffset(API_LIMIT)}`);

  let result = await request(url);

  if (result.length < API_LIMIT - 10) {
    // Just show the first gifs found for the search without offset
    url.searchParams.append("offset", "0");
    result = request(url);
  }

  res.status(200).json(result);
}
