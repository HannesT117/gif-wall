import type { NextPage } from "next";
import Image from "next/image";
import useSWR from "swr";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { getRandomInt } from "../lib/random-int";

const SEARCH_API = "/api/search";
const PLACEHOLDER_ID = "xTkcEQACH24SMPxIQg";
const NUMBER_OF_GIFS = 50;

const getImageUrl = (id: string) => `https://i.giphy.com/media/${id}/giphy.gif`;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getUnusedIndex = (data: any, usedIndices: Set<unknown>) => {
  let index = getRandomInt(data.length);
  let circuitBreaker = NUMBER_OF_GIFS;

  while (usedIndices.has(index) && circuitBreaker > 0) {
    index = getRandomInt(data.length);
    circuitBreaker--;
  }

  return index;
}

const Home: NextPage = () => {
  const router = useRouter();
  const { q, r = 5000 } = router.query;
  const refresh = Number.parseInt(r as string);
  const { data, error } = useSWR(q ? `${SEARCH_API}?q=${q}` : null, fetcher, {
    refreshInterval: refresh * NUMBER_OF_GIFS,
  });

  const usedIndices = useMemo(() => {
    return new Set();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const [currentId, setCurrentId] = useState(PLACEHOLDER_ID);
  useEffect(() => {
    if (data) {
      const interval = setInterval(() => {
        let index = getUnusedIndex(data, usedIndices);

        usedIndices.add(index);
        setCurrentId(data[index].id);
      }, refresh);
      return () => clearInterval(interval);
    }
  }, [data, refresh, usedIndices]);

  if (error) {
    return <div>failed to load</div>
  };
  
  if (!data && q) {
    return (
      <div className={styles.loader__container}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  return (
    <Image
      className={styles.gif}
      src={`${getImageUrl(currentId)}`}
      alt="A random gif"
      unoptimized
      fill
      sizes="100vw" />
  );
};

export default Home;

