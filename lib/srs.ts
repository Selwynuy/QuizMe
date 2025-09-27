export type ReviewGrade = 0 | 1 | 2 | 3 // again, hard, good, easy

export function computeNextReview(
  prevIntervalDays: number,
  prevEase: number,
  grade: ReviewGrade,
): { intervalDays: number; ease: number } {
  // SM-2 inspired, simplified
  let ease = prevEase
  if (grade === 0) {
    return { intervalDays: 0, ease }
  }
  // adjust ease
  const delta = grade === 1 ? -0.15 : grade === 2 ? 0 : 0.15
  ease = Math.max(1.3, ease + delta)

  let intervalDays
  if (prevIntervalDays <= 0) intervalDays = 1
  else if (prevIntervalDays === 1) intervalDays = 3
  else intervalDays = Math.round(prevIntervalDays * ease)

  return { intervalDays, ease }
}
