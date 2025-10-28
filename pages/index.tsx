import type { NextPage } from "next";
import Image from "next/image";
import useSWR from "swr";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

const getImageUrl = (id: string) =>
  `https://i.giphy.com/media/${id}/giphy.webp`;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SEARCH_API = "/api/search";

const Home: NextPage = () => {
  const router = useRouter();
  const { q, refresh = 5000 } = router.query;
  const { data, error } = useSWR(q ? `${SEARCH_API}?q=${q}` : null, fetcher, {
    refreshInterval: Number.parseInt(refresh as string),
  });

  if (error) return <div>failed to load</div>;
  if (!data)
    return (
      <div className={styles.loader__container}>
        <div className={styles.loader}></div>
      </div>
    );

  return (
    <Image
      className={styles.gif}
      src={`${getImageUrl(data?.id)}`}
      layout="fill"
    />
  );
};

export default Home;
