/**
 * Clamps the delay value to match available CSS classes (delay-100 through delay-500)
 * @param delayMs - The desired delay in milliseconds
 * @returns A valid delay class name
 */
export function getDelayClass(delayMs: number): string {
  // Clamp to 100-500 range in 100ms increments
  const clampedDelay = Math.max(100, Math.min(500, Math.round(delayMs / 100) * 100));
  return `delay-${clampedDelay}`;
}

/**
 * Gets a staggered delay class for list items
 * @param index - The item index
 * @param baseDelay - Base delay increment in ms (default: 100)
 * @param modulo - Optional modulo to cycle delays (e.g., 6 for every 6 items)
 * @returns A valid delay class name
 */
export function getStaggeredDelayClass(
  index: number,
  baseDelay: number = 100,
  modulo?: number
): string {
  const effectiveIndex = modulo ? (index % modulo) : index;
  const delayMs = (effectiveIndex + 1) * baseDelay;
  return getDelayClass(delayMs);
}
