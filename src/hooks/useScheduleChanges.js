import { getScheduleChanges } from "../services/scheduleChanges.js";
import { useResource } from "./useResource.js";

export function useScheduleChanges() {
  return useResource(getScheduleChanges);
}
