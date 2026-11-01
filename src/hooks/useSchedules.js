import { getSchedules } from "../services/schedules.js";
import { useResource } from "./useResource.js";

export function useSchedules() {
  return useResource(getSchedules);
}
