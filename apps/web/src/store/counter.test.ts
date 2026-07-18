import { describe, expect, it } from 'vitest'
import { useCounterStore } from './counter'

describe('counter store', () => {
  it('should have initial count of 0', () => {
    const state = useCounterStore.getState()
    expect(state.count).toBe(0)
  })

  it('should increment count', () => {
    const { increment } = useCounterStore.getState()
    increment()
    expect(useCounterStore.getState().count).toBe(1)
  })

  it('should decrement count', () => {
    const { decrement } = useCounterStore.getState()
    decrement()
    expect(useCounterStore.getState().count).toBe(0)
  })

  it('should reset count', () => {
    const { increment, reset } = useCounterStore.getState()
    increment()
    increment()
    reset()
    expect(useCounterStore.getState().count).toBe(0)
  })
})
