import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  writeBatch,
} from 'firebase/firestore';

import firebaseConfig from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const determineCategory = title => {
  if (!title) return 'motel';

  const lowerTitle = title.toLowerCase();

  const normalizedTitle = lowerTitle
    .replace(/[&+\-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (
    normalizedTitle.includes('호텔')
    || normalizedTitle.includes('hotel')
    || normalizedTitle.includes('리조트')
    || normalizedTitle.includes('resort')
  ) {
    return 'hotel';
  }

  if (
    lowerTitle.includes('펜션')
    || lowerTitle.includes('pension')
    || lowerTitle.includes('풀빌라')
    || lowerTitle.includes('풀 빌라')
    || lowerTitle.includes('pool villa')
    || lowerTitle.includes('poolvilla')
    || normalizedTitle.includes('스파 풀')
    || /스파.*풀빌라/.test(normalizedTitle)
    || /스파.*풀 빌라/.test(normalizedTitle)
    || /풀빌라/.test(lowerTitle)
    || /펜션/.test(lowerTitle)
  ) {
    return 'pension';
  }

  return 'motel';
};

const updateCategories = async () => {
  const searchIndexCollection = collection(db, 'search_index');
  const snapshot = await getDocs(searchIndexCollection);

  let totalDocumentsUpdated = 0;

  const updatePromises = [];
  const batchSize = 500;

  let batch = writeBatch(db);

  snapshot.forEach(docSnapshot => {
    const data = docSnapshot.data();
    const title = data.title || '';
    const category = determineCategory(title);
    const currentCategory = data.category || '';

    if (currentCategory !== category) {
      const docRef = doc(db, 'search_index', docSnapshot.id);

      batch.update(docRef, { category: category });
      totalDocumentsUpdated++;

      if (totalDocumentsUpdated % batchSize === 0) {
        updatePromises.push(batch.commit());
        batch = writeBatch(db);
      }
    }
  });

  if (totalDocumentsUpdated % batchSize !== 0) {
    updatePromises.push(batch.commit());
  }

  await Promise.all(updatePromises);
};

updateCategories();
