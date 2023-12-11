"use client"

import { PropsWithChildren, useEffect } from "react"
import { usePersistedUserId } from "@/hooks/use-user"
import { api } from "@/trpc/react"

export default function UserProvider({ children }: PropsWithChildren) {
  const { userId, setUserId } = usePersistedUserId()

  const { data: user } = api.user.get.useQuery(
    { where: { id: userId } },
    { enabled: !!userId },
  )
  const createUserMutation = api.user.creating.useMutation({
    onSuccess: (data) => {
      setUserId(data.id)
    },
  })
  useEffect(() => {
    if (userId) {
      // userId 本地存储有，但数据库未找到（本地被修改/数据库被修改）
      if (user === null) setUserId(undefined)
      // 正常
    } else {
      console.log("-- creating user...")
      createUserMutation.mutate({ data: {} })
    }
  }, [userId, user])

  // console.log(" -- user: ", { userId })
  return <>{children}</>
}
