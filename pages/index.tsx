import type { NextPage } from "next";
import Image from "next/image";
import useSWR from "swr";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const getImageUrl = (id: string) =>
  `https://i.giphy.com/media/${id}/giphy.gif`;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SEARCH_API = "/api/search";
const PLACEHOLDER_ID = "QYpwUb3xVN0HncuHU0"

const getRandomInt = (size: number) => Math.floor(Math.random() * size);

const Home: NextPage = () => {
  const router = useRouter();
  const { q, refresh = 5000 } = router.query;
  const { data, error } = useSWR(q ? `${SEARCH_API}?q=${q}` : null, fetcher);

  const [currentId, setCurrentId] = useState(PLACEHOLDER_ID);
  useEffect(() => {
    if (data) {
      const interval = setInterval(() => {
        setCurrentId(data[getRandomInt(data.length)].id)
      }, Number.parseInt(refresh as string));
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
