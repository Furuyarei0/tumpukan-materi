import { useCallback } from "react";
import { getAdminData } from "../services/admin.js";
import { useResource } from "./useResource.js";

export function useAdminData(isAdmin) {
  const loadAdminData = useCallback(() => getAdminData(isAdmin), [isAdmin]);
  return useResource(loadAdminData, [loadAdminData], isAdmin);
}
