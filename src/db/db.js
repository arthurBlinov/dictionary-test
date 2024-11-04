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

// Sets up the IndexedDB database.
// Creates an object store named 'dictionaries' if it doesn't exist already.
export async function initDB() {
  return openDB(DATABASE_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Create a store with 'id' as the unique key for each entry, set to auto-increment
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('name', 'name', { unique: true });
      }
    },
  });
}


// Adds a new dictionary to the dictionaries store with an empty word list.

export async function addDictionary(db, name) {
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite'); // Starts a transaction to modify data
    await tx.store.add({ name, words: [] }); // Adds the new dictionary with an empty 'words' array
    await tx.done;
  } catch {
    throw new Error('Error occurred');
  }
}

 // Adds a word and its translation to a specific dictionary by its name.

export async function addWordToDictionary(db, dictionaryName, word, translation) {
  try {
    const dictionary = await getOneDictionary(db, dictionaryName); // Find the dictionary by name
    if (dictionary) {
      dictionary.words.push({ word, translation }); // Add new word and translation to dictionary's words array
      const tx = db.transaction(STORE_NAME, 'readwrite');
      await tx.store.put(dictionary); // Save the updated dictionary with the new word
      await tx.done;
    } else {
      throw new Error('Error occurred');
    }
  } catch {
    throw new Error('Error occurred');
  }
}


// Retrieves all dictionaries from the database.
export async function getDictionaries(db) {
  try {
    const tx = db.transaction(STORE_NAME, 'readonly'); // Starts a transaction to read data only
    return await tx.store.getAll(); // Fetches all dictionaries stored
  } catch {
    throw new Error('Error occurred');
  }
}

 
// Retrieves a single dictionary by its name.
export async function getOneDictionary(db, name) {
  try {
    const tx = db.transaction(STORE_NAME, 'readonly');
    return await tx.store.index('name').get(name); // Finds dictionary by its name
  } catch {
    throw new Error('Error occurred');
  }
}

 
// Updates the name of a specific dictionary identified by its ID.
export async function updateDictionary(db, id, updatedName) {
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const dictionary = await tx.store.get(id); // Retrieves dictionary by ID
    if (dictionary) {
      dictionary.name = updatedName; // Changes the dictionary's name
      await tx.store.put(dictionary); // Saves the dictionary with updated name
      await tx.done;
    }
  } catch {
    throw new Error('Error occurred');
  }
}

// Deletes a dictionary by its ID.
export async function deleteDictionary(db, id) {
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.store.delete(id); // Removes dictionary by its ID
    await tx.done;
  } catch {
    throw new Error('Error occurred');
  }
}


// Retrieves all words from a dictionary specified by its name.
export async function getWordsByDictionaryName(db, dictionaryName) {
  try {
    const dictionary = await getOneDictionary(db, dictionaryName);
    return dictionary ? dictionary.words : []; // Returns the words if dictionary is found
  } catch {
    throw new Error('Error occurred');
  }
}

 
// Finds a word and its translation in a specific dictionary.
export async function getOnePairOfWords(db, dictionaryName, word) {
  try {
    const words = await getWordsByDictionaryName(db, dictionaryName);
    return words.find(item => item.word === word) || null; // Searches for a word match
  } catch {
    throw new Error('Error occurred');
  }
}

 
// Updates a word pair (word and translation) in a dictionary.
export async function updateWordInDictionary(db, dictionaryName, originalWord, originalTranslation, updatedTranslation) {
  try {
    const dictionary = await getOneDictionary(db, dictionaryName); // Get the dictionary by name
    if (dictionary) {
      const wordIndex = dictionary.words.findIndex(
        item => item.word === originalWord && item.translation === originalTranslation
      );
      if (wordIndex > -1) {
        dictionary.words[wordIndex] = updatedTranslation; // Changes the word translation
        const tx = db.transaction(STORE_NAME, 'readwrite');
        await tx.store.put(dictionary); // Saves the dictionary with updated word
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


// Removes a specific word pair (word and translation) from a dictionary.
export async function deleteWordFromDictionary(db, dictionaryName, word, translation) {
  try {
    const dictionary = await getOneDictionary(db, dictionaryName); // Get dictionary by name
    if (dictionary) {
      dictionary.words = dictionary.words.filter(item => item.word !== word || item.translation !== translation);
      const tx = db.transaction(STORE_NAME, 'readwrite');
      await tx.store.put(dictionary); // Saves the dictionary after removing the word pair
      await tx.done;
    }
  } catch {
    throw new Error('Error occurred');
  }
}



  