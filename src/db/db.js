import { openDB } from 'idb';

const DATABASE_NAME = 'dictionaryDB';
const STORE_NAME = 'dictionaries';

export async function initDB() {
  return openDB(DATABASE_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('name', 'name', { unique: true });
      }
    },
  });
}
export async function addDictionary(db, name) {
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.store.add({ name, words: [] });
    await tx.done;
  } catch {
    throw new Error('Error occurred');
  }
}
export async function addWordToDictionary(db, dictionaryName, word, translation) {
  try {
    const dictionary = await getOneDictionary(db, dictionaryName);
    if (dictionary) {
      dictionary.words.push({ word, translation });
      const tx = db.transaction(STORE_NAME, 'readwrite');
      await tx.store.put(dictionary);
      await tx.done;
    } else {
      throw new Error('Error occurred');
    }
  } catch {
    throw new Error('Error occurred');
  }
}
export async function getDictionaries(db) {
  try {
    const tx = db.transaction(STORE_NAME, 'readonly');
    return await tx.store.getAll();
  } catch {
    throw new Error('Error occurred');
  }
}
export async function getOneDictionary(db, name) {
  try {
    const tx = db.transaction(STORE_NAME, 'readonly');
    return await tx.store.index('name').get(name);
  } catch {
    throw new Error('Error occurred');
  }
}
export async function updateDictionary(db, id, updatedName) {
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const dictionary = await tx.store.get(id);
    if (dictionary) {
      dictionary.name = updatedName;
      await tx.store.put(dictionary);
      await tx.done;
    }
  } catch {
    throw new Error('Error occurred');
  }
}
export async function deleteDictionary(db, id) {
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.store.delete(id);
    await tx.done;
  } catch {
    throw new Error('Error occurred');
  }
}
export async function getWordsByDictionaryName(db, dictionaryName) {
  try {
    const dictionary = await getOneDictionary(db, dictionaryName);
    return dictionary ? dictionary.words : [];
  } catch {
    throw new Error('Error occurred');
  }
}
export async function getOnePairOfWords(db, dictionaryName, word) {
  try {
    const words = await getWordsByDictionaryName(db, dictionaryName);
    return words.find(item => item.word === word) || null;
  } catch {
    throw new Error('Error occurred');
  }
}
export async function updateWordInDictionary(db, dictionaryName, originalWord, originalTranslation, updatedTranslation) {
  try {
    const dictionary = await getOneDictionary(db, dictionaryName);
    if (dictionary) {
      const wordIndex = dictionary.words.findIndex(
        item => item.word === originalWord && item.translation === originalTranslation
      );
      if (wordIndex > -1) {
        dictionary.words[wordIndex] = updatedTranslation;
        const tx = db.transaction(STORE_NAME, 'readwrite');
        await tx.store.put(dictionary);
        await tx.done;
      } else {
        throw new Error('Error occurred');
      }
    } else {
      throw new Error('Error occurred');
    }
  } catch {
    throw new Error('Error occurred');
  }
}
export async function deleteWordFromDictionary(db, dictionaryName, word, translation) {
  try {
    const dictionary = await getOneDictionary(db, dictionaryName);
    if (dictionary) {
      dictionary.words = dictionary.words.filter(item => item.word !== word || item.translation !== translation);
      const tx = db.transaction(STORE_NAME, 'readwrite');
      await tx.store.put(dictionary);
      await tx.done;
    }
  } catch {
    throw new Error('Error occurred');
  }
}


  