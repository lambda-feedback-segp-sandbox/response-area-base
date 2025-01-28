import _ from 'lodash'
import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

type UseDeepCompareEffectFunction = (
  effect: EffectCallback,
  deps?: DependencyList,
  options?: {
    skipInitialEffect?: boolean
  },
) => void

export const useDeepCompareEffect: UseDeepCompareEffectFunction = (
  callback,
  deps,
  options,
) => {
  const prevValue = useRef(
    options?.skipInitialEffect === false ? undefined : deps,
  )
  useEffect(() => {
    if (_.isEqual(prevValue.current, deps)) {
      return
    }
    prevValue.current = _.cloneDeep(deps)
    return callback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
