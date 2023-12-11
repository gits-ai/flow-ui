import { create, StateCreator } from "zustand"
import { persist } from "zustand/middleware"

import { produce } from "immer"
import { Producer } from "@/types/immer"

// 不要用lodash的capitalize，因为它会把其他字符都变小写
export const capitalize = (s: string) => s[0]?.toUpperCase() + s.substring(1)

export type BearSlice<K extends string, V> = {
  [P in K]: V
} & {
  [P in `set${Capitalize<K>}`]: (v: V | Producer<V>) => void
}

const createBearSlice =
  <K extends string, V>(
    k: K,
    defaultValue: V,
  ): StateCreator<BearSlice<K, V>, [], [], BearSlice<K, V>> =>
  (setState, getState, store) => {
    return {
      [k]: defaultValue,
      [`set${capitalize(k)}`]: (v: V | Producer<V>) => {
        const newState = typeof v === "function" ? produce(getState()[k], v) : v
        // console.log(
        //   `%c -- set(${k}): ${JSON.stringify(newState, null, 2)}`,
        //   "color: blue;",
        // )
        setState({ [k]: newState } as Partial<BearSlice<K, V>>)
      },
    } as BearSlice<K, V>
  }

/**
 * 不能命名为useBearStore，这样会违反 react-hook 不能在 top level 调用的规则
 */
export const createBearStore =
  <V>() =>
  <K extends string>(k: K, defaultValue: V, persistEnabled?: boolean) => {
    const f = (...a: any[]) => ({
      // @ts-ignore
      ...createBearSlice<K, V>(k, defaultValue)(...a),
    })
    return persistEnabled
      ? create<BearSlice<K, V>>()(
          // persist middleware
          persist(f, {
            name:
              // bc-official
              "oau." + k,
            version: 0.3,
            migrate: (persistedState: any, version) => {
              if (version == 0.1) {
                delete persistedState.userId
              }
              return persistedState
            },
          }),
        )
      : create<BearSlice<K, V>>()(f)
  }
