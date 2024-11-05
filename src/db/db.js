// IndexedDB is a browser-based database that lets you store large 
// amounts of data for offline use and easy 
// access. It organizes data into "object stores," which work 
// like tables but store key-value pairs, 
// such as JavaScript objects and arrays, instead of rows 
// and columns. You interact with the data 
// through transactions, allowing you to add, read, or update 
// data without slowing down the main application.

// Import of openDB function from the IndexedDB library
// The openDB function from the idb library opens or creates an IndexedDB database.
// If the database doesn’t exist yet, it will create a new one. 
import { openDB } from 'idb';

const DATABASE_NAME = 'dictionaryDB';
const STORE_NAME = 'dictionaries';

// Sets up the IndexedDB database, creating a store named 'dictionaries' with an 'id' key.
export async function initDB() {
  return openDB(DATABASE_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex("languageIndex", ["language1", "language2"], { unique: false });
      }
    },
  });
}


// Adds a new dictionary with separate fields for language1 and language2, and an empty words array.
export async function addDictionary(db, language1, language2) {
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.add({ language1, language2, words: [] }); 
    await tx.done;
  } catch (error) {
    throw new Error("Failed to add dictionary");
  }
}

// Adds a word and its translation to a dictionary specified by its ID
export async function addWordToDictionary(db, dictionaryId, word, translation) {
  try {
    const dictionary = await getOneDictionary(db, dictionaryId);

    if (dictionary) {
      // Assign a unique auto-incremented ID for the new word
      const newWord = {
        id: dictionary.words.length,
        word,
        translation
      };

      dictionary.words.push(newWord);
      const tx = db.transaction(STORE_NAME, 'readwrite');
      await tx.store.put(dictionary);
      await tx.done;

    } else {
      throw new Error("Dictionary not found");
    }
  } catch (error) {
    throw new Error("Sorry, failed to add word to dictionary, error");
  }
}


// Retrieves all dictionaries from the database.
export async function getDictionaries(db) {
  try {
    const tx = db.transaction(STORE_NAME, 'readonly');
    return await tx.store.getAll();
  } catch (error) {
    throw new Error("Sorry, failed to get dictionaries, error");
  }
}

// Retrieves a single dictionary by its ID.
export async function getOneDictionary(db, id) {
  try {
    const tx = db.transaction(STORE_NAME, 'readonly');
    return await tx.store.get(Number(id));
  } catch (error) {
    throw new Error("Sorry, failed to get dictionary, error");
  }
}

// Updates the languages of a specific dictionary by its ID.
export async function updateDictionary(db, id, updatedLanguage1, updatedLanguage2) {
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const dictionary = await tx.store.get(Number(id));
    if (dictionary) {
      dictionary.language1 = updatedLanguage1;
      dictionary.language2 = updatedLanguage2;
      await tx.store.put(dictionary);
      await tx.done;
    }
    return;
  } catch (error) {
    throw new Error("Sorry, failed to update dictionary, error");
  }
}

// Deletes a dictionary by its ID.
export async function deleteDictionary(db, id) {
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.store.delete(Number(id));
    await tx.done;
  } catch (error) {
    throw new Error("Sorry, the dictionary is not deleted, error");
  }
}

// Retrieves all words in a dictionary specified by its ID.
export async function getWordsByDictionaryId(db, dictionaryId) {
  try {
    const dictionary = await getOneDictionary(db, dictionaryId);
    return dictionary ? dictionary.words : [];
  } catch (error) {
    throw new Error("Sorry, failed to retrieve words in this dictionary, error");
  }
}

// Retrieves a single word in a dictionary by word ID.
export async function getOnePairOfWords(db, dictionaryId, wordId) {
  try {
    const words = await getWordsByDictionaryId(db, dictionaryId);
    return words.find(item => item.id === wordId) || null;
  } catch (error) {
    throw new Error("Sorry, failed to retrieve words, error");
  }
}

// Updates a word pair in a dictionary by word ID.
export async function updateWordInDictionary(db, dictionaryId, wordId, updatedWord, updatedTranslation) {
  console.log(dictionaryId, wordId, updatedWord, updatedTranslation);
  
  try {
    const dictionary = await getOneDictionary(db, dictionaryId);
    if (dictionary) {
      const wordIndex = dictionary.words.findIndex(item => item.id === Number(wordId));
      if (wordIndex > -1) {
        dictionary.words[wordIndex].word = updatedWord;
        dictionary.words[wordIndex].translation = updatedTranslation;
        
        const tx = db.transaction(STORE_NAME, 'readwrite');
        await tx.store.put(dictionary);
        await tx.done;
      } else {
        throw new Error("Sorry, word is not found in dictionary, error");
      }
    } else {
      throw new Error("Dictionary not found");
    }
  } catch (error) {
    throw new Error("Sorry, failed to update word in dictionary, error");
  }
}

// Deletes a word from a dictionary by word ID.
export async function deleteWordFromDictionary(db, dictionaryId, wordId) {
  try {
    const dictionary = await getOneDictionary(db, dictionaryId);
    if (dictionary) {
      dictionary.words = dictionary.words.filter(item => item.id !== Number(wordId));
      const tx = db.transaction(STORE_NAME, 'readwrite');
      await tx.store.put(dictionary);
      await tx.done;
    }
  } catch (error) {
    throw new Error("Sorry, failed to delete word from dictionary, error");
  }
}




  