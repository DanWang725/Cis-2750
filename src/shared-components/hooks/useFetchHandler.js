import { useState, useEffect } from 'react';

const useFetchHandler = (
  url,
  onSuccess,
  onError = (err) => console.error(err),
) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchData = async () => {
    fetch(url)
      .then((response) => response.json())
      .then(onSuccess)
      .catch(onError);
  };
  useEffect(() => {
    if (hasFetched) return;

    setHasFetched(true);
    fetchData().then(() => setIsLoaded(true));
  }, [hasFetched]);

  const forceFetch = () => {
    setIsLoaded(false);
    setHasFetched(false);
  };

  return { isLoaded, forceFetch };
};
export default useFetchHandler;
