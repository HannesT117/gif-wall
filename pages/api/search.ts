// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import fetch from "node-fetch";

type Data = any;

const ENDPOINT = "https://api.giphy.com/v1/gifs/search";
const API_KEY = "INSERT_API_KEY";
const RAITING = "r";

const getRandomInt = (size: number) => Math.floor(Math.random() * size);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const searchTerms = req.query.q as string;
  const url = new URL(ENDPOINT);
  url.searchParams.append("api_key", API_KEY);
  url.searchParams.append("q", searchTerms);
  url.searchParams.append("rating", RAITING);

  const response = await fetch(url.toString());
  const { data } = (await response.json()) as any;

  res.status(200).json(data[getRandomInt(data.length)]);
}
