export function percentDelta(current: number, previous: number): number | null {
  if (previous <= 0) return current > 0 ? 100 : null;
  return ((current - previous) / previous) * 100;
}

export function percentPointDelta(
  current: number,
  previous: number,
): number | null {
  if (previous === 0 && current === 0) return null;
  return current - previous;
}

export function percentile(samples: Array<number>, p: number): number | null {
  if (samples.length === 0) return null;
  const sorted = [...samples].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(sorted.length - 1, index))] ?? null;
}

export function downsample(
  values: Array<number>,
  buckets: number,
): Array<number> {
  if (values.length === 0) return Array.from({ length: buckets }, () => 0);
  if (values.length <= buckets) return values;

  const result: Array<number> = [];
  const size = values.length / buckets;
  for (let i = 0; i < buckets; i += 1) {
    const start = Math.floor(i * size);
    const end = Math.floor((i + 1) * size);
    const slice = values.slice(start, Math.max(start + 1, end));
    const avg = slice.reduce((sum, n) => sum + n, 0) / slice.length;
    result.push(avg);
  }
  return result;
}
