import type { NextPage } from "next";
import Image from "next/image";
import useSWR from "swr";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { getRandomInt } from "../lib/random-int";

const SEARCH_API = "/api/search";
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
};

const Home: NextPage = () => {
  const router = useRouter();
  const { q, r = 5000, rating: urlRating } = router.query;
  const refresh = Number.parseInt(r as string);

  const [searchTerms, setSearchTerms] = useState("");
  const [rating, setRating] = useState("pg");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerms.trim()) {
      router.push(`/?q=${encodeURIComponent(searchTerms)}&rating=${rating}`);
    }
  };

  const { data, error } = useSWR(
    q ? `${SEARCH_API}?q=${q}${urlRating ? `&rating=${urlRating}` : ""}` : null,
    fetcher,
    {
      refreshInterval: refresh * NUMBER_OF_GIFS,
    }
  );

  const usedIndices = useMemo(() => {
    return new Set();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const [currentId, setCurrentId] = useState<string | null>(null);
  useEffect(() => {
    if (data && data.length > 0) {
      // Set initial GIF immediately
      if (!currentId) {
        const initialIndex = getRandomInt(data.length);
        usedIndices.add(initialIndex);
        setCurrentId(data[initialIndex].id);
      }

      const interval = setInterval(() => {
        let index = getUnusedIndex(data, usedIndices);

        usedIndices.add(index);
        setCurrentId(data[index].id);
      }, refresh);
      return () => clearInterval(interval);
    }
  }, [data, refresh, usedIndices, currentId]);

  if (error) {
    return <div>failed to load</div>;
  }

  if (!q) {
    return (
      <div className={styles.searchContainer}>
        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <input
            type="text"
            value={searchTerms}
            onChange={(e) => setSearchTerms(e.target.value)}
            placeholder="party,celebration,cats"
            className={styles.searchInput}
            autoFocus
          />
          <p className={styles.helperText}>
            Enter search terms separated by commas (no spaces)
          </p>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className={styles.ratingSelect}
          >
            <option value="g">G - General Audiences</option>
            <option value="pg">PG - Parental Guidance</option>
            <option value="pg-13">PG-13 - Parents Strongly Cautioned</option>
            <option value="r">R - Restricted</option>
          </select>
          <button type="submit" className={styles.searchButton}>
            Start GIF Wall
          </button>
        </form>
      </div>
    );
  }

  if (!currentId || !data) {
    return (
      <div className={styles.loader__container}>
        <svg
          className={styles.pacman}
          viewBox="0 0 220 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="60" cy="50" r="25" fill="#FFD700" />
          <path
            className={styles.pacmanMouth}
            d="M 60 50 L 85 35 L 85 65 Z"
            fill="#1a1a1a"
          />
          <circle className={styles.dot} cx="110" cy="50" r="5" fill="#FFF" />
          <circle className={styles.dot} cx="140" cy="50" r="5" fill="#FFF" />
          <circle className={styles.dot} cx="170" cy="50" r="5" fill="#FFF" />
        </svg>
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
      sizes="100vw"
    />
  );
};

export default Home;
