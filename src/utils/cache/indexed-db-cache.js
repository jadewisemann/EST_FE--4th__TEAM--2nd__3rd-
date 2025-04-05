export const createIndexedDBCache = (
  storeName,
  {
    dbName = 'GenericCacheDB',
    dbVersion = 1,
    cacheExpiration = 5 * 60 * 1000,
  } = {},
) => {
  const initDB = () =>
    new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, dbVersion);
      request.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

  const getFromCache = async key => {
    const db = await initDB();
    return new Promise(resolve => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const cache = request.result;
        resolve(cache && cache.expiry > Date.now() ? cache.data : null);
      };
      request.onerror = () => resolve(null);
    });
  };

  const saveToCache = async data => {
    if (!data || !data.id) {
      throw new Error('저장할 데이터는 "id" 프로퍼티가 필요합니다.');
    }
    const db = await initDB();
    return new Promise(resolve => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.put({
        id: data.id,
        data: data,
        expiry: Date.now() + cacheExpiration,
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  };

  return { getFromCache, saveToCache };
};
