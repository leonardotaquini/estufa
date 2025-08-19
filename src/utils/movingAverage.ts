export function movingAverage(
  data: number[],
  window: number
): (number | null)[] {
  if (window <= 1) return data;

  const result: (number | null)[] = Array(data.length).fill(null);
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    sum += data[i];
    if (i >= window) {
      sum -= data[i - window];
    }
    if (i >= window - 1) {
      result[i] = sum / window;
    }
  }

  return result;
}
