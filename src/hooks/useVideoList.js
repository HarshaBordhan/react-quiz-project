import {
  get,
  getDatabase,
  limitToFirst,
  orderByKey,
  query,
  ref,
  startAt,
} from 'firebase/database';
import { useEffect, useState } from 'react';

export default function useVideoList(page) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [videos, setVideos] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      // database related works
      const db = getDatabase();
      const videosRef = ref(db, 'videos');
      const videoQuery = query(
        videosRef,
        orderByKey(),
        startAt('' + page), // 'page' is a number, so we made it string by ('' +  page)
        limitToFirst(8) // videos from start, 'limitToLast' start from the end
      );

      try {
        setError(false);
        setLoading(true);
        // request firebase database
        const snapshot = await get(videoQuery);
        setLoading(false);
        if (snapshot.exists()) {
          // console.log(snapshot);
          setVideos(prevVideos => {
            return [...prevVideos, ...Object.values(snapshot.val())];
          });
          // console.log(snapshot.val());
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(true);
      }
    }

    fetchVideos();
  }, [page]);

  return {
    loading,
    error,
    videos,
    hasMore,
  };
}
