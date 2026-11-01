import { useCallback } from "react";
import { getMaterials } from "../services/materials.js";
import { useResource } from "./useResource.js";

export function useMaterials(courseId = null, enabled = true) {
  const loadMaterials = useCallback(() => getMaterials(courseId), [courseId]);
  return useResource(loadMaterials, [loadMaterials], enabled);
}
