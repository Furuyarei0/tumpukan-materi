import { useEffect, useState } from "react";

const NO_DEPENDENCIES = [];

export function useResource(load, dependencies = NO_DEPENDENCIES, enabled = true) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (!enabled) {
      setData([]);
      setIsLoading(false);
      setError(null);
      return () => {
        active = false;
      };
    }

    async function loadResource() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await load();
        if (active) setData(result);
      } catch (loadError) {
        if (active) setError(loadError);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadResource();
    const refresh = () => loadResource();
    window.addEventListener("tumpukan:admin-data-change", refresh);
    return () => {
      active = false;
      window.removeEventListener("tumpukan:admin-data-change", refresh);
    };
  }, [...dependencies, enabled, load]);

  return { data, isLoading, error };
}
