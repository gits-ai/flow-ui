import { createBearStore } from "@/utils/create-bear-store"

export const usePersistedUserId = createBearStore<string | undefined>()(
  "userId",
  undefined,
  true,
)
