export const toQueryString = (
  obj: Record<string, string | number | boolean | undefined>,
) => {
  return Object.entries(obj)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
    .join("&");
};
