import { useState, useEffect } from 'react';

const useFetchHandler = (
  url,
  onSuccess,
  onError = (err) => console.error(err),
) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!hasFetched) {
      setHasFetched(true);
      setIsLoaded(false);

      const fetchData = async () => {
        fetch(url)
          .then((response) => {
            setIsLoaded(true);
            return response.json();
          })
          .then(onSuccess)
          .catch(onError);
      };

      fetchData();
    }
  }, [hasFetched]);

  const forceFetch = () => setHasFetched(false);
  return { isLoaded, forceFetch };
};
export default useFetchHandler;
