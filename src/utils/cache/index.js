import { createIndexedDBCache } from './indexed-db-cache.js';
import { createMemoryCache } from './memory-cache.js';

export const createCacheUtil = (
  storeName,
  { cacheExpiration = 5 * 60 * 1000, dbName, dbVersion } = {},
) => {
  const memoryCache = createMemoryCache(cacheExpiration);
  const dbCache = createIndexedDBCache(storeName, {
    dbName,
    dbVersion,
    cacheExpiration,
  });

  const get = async key => {
    let data = memoryCache.get(key);
    if (data) return data;

    data = await dbCache.getFromCache(key);
    if (data) memoryCache.set(key, data);
    return data;
  };

  const set = async (key, data) => {
    memoryCache.set(key, data);
    await dbCache.saveToCache({ id: key, ...data });
  };

  return { get, set };
};
