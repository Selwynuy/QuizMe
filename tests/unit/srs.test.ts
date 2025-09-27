import { describe, it, expect } from 'vitest'
import { computeNextReview } from '@/lib/srs'

describe('computeNextReview', () => {
  it('again (0) resets interval to 0 and keeps ease', () => {
    const res = computeNextReview(5, 2.5, 0)
    expect(res.intervalDays).toBe(0)
    expect(res.ease).toBe(2.5)
  })

  it('hard (1) reduces ease and grows interval slowly', () => {
    const res = computeNextReview(3, 2.5, 1)
    expect(res.ease).toBeGreaterThanOrEqual(1.3)
    expect(res.ease).toBeLessThan(2.5)
    expect(res.intervalDays).toBeGreaterThan(3)
  })

  it('good (2) keeps ease and increases interval', () => {
    const res = computeNextReview(3, 2.5, 2)
    expect(res.ease).toBe(2.5)
    expect(res.intervalDays).toBeGreaterThan(3)
  })

  it('easy (3) increases ease and interval', () => {
    const res = computeNextReview(3, 2.5, 3)
    expect(res.ease).toBeGreaterThan(2.5)
    expect(res.intervalDays).toBeGreaterThan(3)
  })

  it('first reviews follow 1 then 3 days', () => {
    const day1 = computeNextReview(0, 2.5, 2)
    expect(day1.intervalDays).toBe(1)
    const day3 = computeNextReview(1, 2.5, 2)
    expect(day3.intervalDays).toBe(3)
  })
})
