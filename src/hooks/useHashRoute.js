import { useCallback, useEffect, useState } from "react";

function readRoute() {
  const hash = window.location.hash;
  if (hash === "#admin") return { type: "admin", id: "dashboard" };
  const adminMatch = hash.match(/^#admin\/([^/?#]+)/);
  if (adminMatch) return { type: "admin", id: decodeURIComponent(adminMatch[1]) };
  const match = hash.match(/^#(course|task|submit)\/([^/?#]+)/);
  if (!match) return null;

  const route = { type: match[1], id: decodeURIComponent(match[2]) };
  const query = window.location.hash.split("?")[1];
  const materialId = query ? new URLSearchParams(query).get("material") : null;
  if (route.type === "course" && materialId) route.materialId = materialId;
  return route;
}

export function useHashRoute() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const syncRoute = () => setRoute(readRoute());
    window.addEventListener("popstate", syncRoute);
    window.addEventListener("hashchange", syncRoute);
    return () => {
      window.removeEventListener("popstate", syncRoute);
      window.removeEventListener("hashchange", syncRoute);
    };
  }, []);

  const openRoute = useCallback((type, id) => {
    const routeId = id ? encodeURIComponent(id) : "";
    const hash = type === "admin" && (!routeId || id === "dashboard")
      ? "#admin"
      : `#${type}/${routeId}`;
    window.history.pushState({ ...window.history.state, tumpukanOverlay: true }, "", hash);
    setRoute(type === "admin" ? { type, id: id || "dashboard" } : { type, id });
  }, []);

  const openCourseMaterial = useCallback((courseId, materialId) => {
    const route = readRoute();
    const courseHash = `#course/${encodeURIComponent(courseId)}`;
    if (route?.type !== "course" || route.id !== courseId) {
      window.history.pushState({ tumpukanOverlay: true }, "", courseHash);
    }

    const materialHash = `${courseHash}?material=${encodeURIComponent(materialId)}`;
    window.history.pushState({ tumpukanOverlay: true, tumpukanMaterialPreview: true }, "", materialHash);
    setRoute({ type: "course", id: courseId, materialId });
  }, []);

  const closeCourseMaterial = useCallback(() => {
    if (window.history.state?.tumpukanMaterialPreview) {
      window.history.back();
      return;
    }

    const route = readRoute();
    if (route?.type !== "course" || !route.materialId) return;
    const hash = `#course/${encodeURIComponent(route.id)}`;
    window.history.replaceState(window.history.state, "", hash);
    setRoute({ type: "course", id: route.id });
  }, []);

  const closeRoute = useCallback(() => {
    if (window.history.state?.tumpukanMaterialPreview) {
      window.history.go(-2);
      return;
    }
    if (window.history.state?.tumpukanOverlay) {
      window.history.back();
      return;
    }

    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    setRoute(null);
  }, []);

  const goHome = useCallback(() => {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#home`);
    setRoute(null);
    window.scrollTo(0, 0);
  }, []);

  return { route, openRoute, openCourseMaterial, closeCourseMaterial, closeRoute, goHome };
}
