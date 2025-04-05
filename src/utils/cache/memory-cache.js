export const createMemoryCache = (cacheExpiration = 5 * 60 * 1000) => {
  const cache = new Map();

  const get = key => {
    const entry = cache.get(key);
    if (!entry) return null;
    if (entry.expiry > Date.now()) return entry.data;
    // 만료된 데이터는 제거
    cache.delete(key);
    return null;
  };

  const set = (key, data) => {
    cache.set(key, { data, expiry: Date.now() + cacheExpiration });
  };

  return { get, set };
};
