import { getAnnouncements } from "../services/announcements.js";
import { useResource } from "./useResource.js";

export function useAnnouncements() {
  return useResource(getAnnouncements);
}
