import type { NextPage } from "next";
import Image from "next/image";
import useSWR from "swr";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getRandomInt } from "../lib/random-int";

const SEARCH_API = "/api/search";
const PLACEHOLDER_ID = "QYpwUb3xVN0HncuHU0";

const getImageUrl = (id: string) => `https://i.giphy.com/media/${id}/giphy.gif`;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Home: NextPage = () => {
  const router = useRouter();
  const { q, r = 5000 } = router.query;
  const refresh = Number.parseInt(r as string);
  const { data, error } = useSWR(q ? `${SEARCH_API}?q=${q}` : null, fetcher, {
    refreshInterval: refresh * 50, // 50 is a magic number (how many gifs are fetch from the api)
  });

  const [currentId, setCurrentId] = useState(PLACEHOLDER_ID);
  useEffect(() => {
    if (data) {
      const interval = setInterval(() => {
        setCurrentId(data[getRandomInt(data.length)].id);
      }, refresh)
      return () => clearInterval(interval);
    }
  }, [data, refresh]);

  if (error) return <div>failed to load</div>;
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
      layout="fill"
    />
  );
};

export default Home;
