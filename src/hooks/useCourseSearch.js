import { useEffect, useRef, useState } from "react";
import { searchCoursesAndMaterials } from "../services/search.js";
import { normalizeSearchTerm } from "../lib/search.js";

const EMPTY_RESULTS = { courses: [], materials: [] };

export function useCourseSearch(query, debounceMs = 250) {
  const [results, setResults] = useState(EMPTY_RESULTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestId = useRef(0);
  const normalizedQuery = normalizeSearchTerm(query);

  useEffect(() => {
    const currentRequestId = ++requestId.current;
    if (!normalizedQuery) {
      setResults(EMPTY_RESULTS);
      setIsLoading(false);
      setError(null);
      return undefined;
    }

    setIsLoading(true);
    setError(null);
    const timer = window.setTimeout(async () => {
      try {
        const nextResults = await searchCoursesAndMaterials(normalizedQuery);
        if (requestId.current === currentRequestId) setResults(nextResults);
      } catch (searchError) {
        if (requestId.current === currentRequestId) setError(searchError);
      } finally {
        if (requestId.current === currentRequestId) setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      window.clearTimeout(timer);
      requestId.current += 1;
    };
  }, [debounceMs, normalizedQuery]);

  return { results, isLoading, error, normalizedQuery };
}
