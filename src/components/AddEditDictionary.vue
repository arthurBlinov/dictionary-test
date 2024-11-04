<template>
     <BodyForAll>
      <ErrorPopup v-if="showErrorPopup" :message="errorMessage" @close="closeErrorPopup" />
      <h2>Words ({{ displayedWords.length }})</h2>
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search word or translation"
        />
        <font-awesome-icon icon="search" class="search-icon" />
      </div>
      <ul class="words-list">
        <li
          v-if="paginatedWords.length === 0"
          class="no-words"
        >
          {{ searchQuery ? 'No words found' : 'No words yet' }}
        </li>
        <li
          v-else
          v-for="(word, index) in paginatedWords"
          :key="index"
          class="word-item"
        >
          <div class="word-info-position">
            <div class="word-info">
              <span class="word">{{ word.word }}</span>
              <span id="dash">-</span>
              <span class="translation">{{ word.translation }}</span>
            </div>
            <div class="info-play-alg">0/0</div>
          </div>
          <RouterLink
            :to="{
                name: 'editWords',
                params: { dictName: dictionaryName, word: word.word, translation: word.translation }
            }"
            class="edit-icon"
            >
        <font-awesome-icon icon="pen" />
        </RouterLink>
        </li>
      </ul>
      <div v-if="totalPages > 1" class="pagination">
        <button v-if="currentPage > 1" @click="goToPage(currentPage - 1)">←</button>
        <button v-if="shouldShowLeftEllipsis" disabled>...</button>
        <button
          v-for="page in visiblePages"
          :key="page"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button v-if="shouldShowRightEllipsis" disabled>...</button>
        <button v-if="currentPage < totalPages" @click="goToPage(currentPage + 1)">→</button>
      </div>
      <RouterLink :to="`/add-new-word/${dictionaryName}`" class="add-word-button">Add New Word</RouterLink>
    </BodyForAll>
  </template>
  
  <script>
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { faSearch, faPen } from '@fortawesome/free-solid-svg-icons';
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { initDB, getWordsByDictionaryName } from '@/db/db';
  import BodyForAll from "./partitians/BodyForAll.vue";
import ErrorPopup from './ErrorPopup.vue';
  
  library.add(faSearch, faPen);
  
  export default {
  name: 'DictionaryWords',
  components: {
    FontAwesomeIcon,
    BodyForAll,
    ErrorPopup
  },
  data() {
    return {
      words: [],
      searchQuery: '',
      currentPage: 1,
      wordsPerPage: 6,
      maxVisiblePages: 3,
      showErrorPopup: false,
      errorMessage: '', 
    };
  },
  computed: {
    dictionaryName() {
      return this.$route.params.dictName;
    },
    filteredWords() {
      if (!this.searchQuery) return this.words;
      return this.words.filter(
        (word) =>
          word.word.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          word.translation.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    displayedWords() {
      return this.filteredWords;
    },
    paginatedWords() {
      const startIndex = (this.currentPage - 1) * this.wordsPerPage;
      return this.displayedWords.slice(startIndex, startIndex + this.wordsPerPage);
    },
    totalPages() {
      return Math.ceil(this.displayedWords.length / this.wordsPerPage);
    },
    visiblePages() {
      const pages = [];
      const start = Math.max(2, this.currentPage - 2);
      const end = Math.min(this.totalPages - 1, this.currentPage + 2);

      if (this.totalPages > 1) pages.push(1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (this.totalPages > 1) pages.push(this.totalPages);

      return pages;
    },
    shouldShowLeftEllipsis() {
      return this.currentPage > 3;
    },
    shouldShowRightEllipsis() {
      return this.currentPage < this.totalPages - 2;
    },
  },
  methods: {
    goToPage(page) {
      this.currentPage = page;
    },
  },
  async created() {
    try {
      const db = await initDB();
      this.words = await getWordsByDictionaryName(db, this.dictionaryName);
    } catch (error) {
      this.errorMessage = error;
      this.showErrorPopup = true;
    }
  },
  closeErrorPopup() {
      this.showErrorPopup = false;
    }
};
</script>
  
  
  <style scoped lang="scss">
  @import "@/styles/main.scss";
  
    h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: $bg-main;
    }
  
    .search-container {
      position: relative;
      width: 100%;
      max-width: 600px;
      margin-bottom: 1rem;
  
      input {
        width: 100%;
        padding: $font-size;
        font-size: $font-size;
        border: 1px solid $gray;
        border-radius: 3rem;
        outline: none;
  
        &::placeholder {
          color: $gray;
        }
      }
  
      .search-icon {
        position: absolute;
        right: 1.1rem;
        top: 50%;
        transform: translateY(-50%);
        color: $bg-main;
        font-size: $font-size;
        cursor: pointer;
      }
    }
  
    .words-list {
      list-style: none;
      padding: 0;
      width: 100%;
      margin-bottom: 20px;
      background-color: $bg-buttons-lists;
      border-radius: $big-font-size;
  
      .no-words {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: $big-font-size;
        height: 5rem;
        border-bottom: none;
      }
  
      .word-item {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        position: relative;
        border-bottom: 1px solid $gray;
  
        &:last-child {
          border-bottom: none;
        }
  
        .word-info-position {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
  
        .word-info {
          display: flex;
          align-items: center;
         
          .word {
            font-size: $big-font-size;
            margin-right: 0.3rem;
          }
  
          #dash {
            margin: 0 0.5rem;
            font-size: $big-font-size;
          }
  
          .translation {
            font-size: $big-font-size;
          }
        }
  
        .info-play-alg {
          font-size: $font-size;
          color: $bg-main;
          margin-top: 4px;
        }
  
        .edit-icon {
          font-size: 1.5rem;
          color: $bg-main;
          cursor: pointer;
          align-self: center;
        }
      }
    }
  
    .pagination {
        display: flex;
        justify-content: center;
        margin-top: 1rem;
        align-self: center;
    button {
        margin: 1rem 0.2rem;
        padding: 0.5rem 1rem;
        font-size: $font-size;
        cursor: pointer;
        background: transparent;
        border: 1px solid $bg-main;
        border-radius: 4px;

        &.active {
        font-weight: bold;
        background-color: $bg-main;
        color: $white;
        }
    }
        }
  
    .add-word-button {
      padding: 10px 20px;
      font-size: 2rem;
      color: $white;
      background-color: $bg-main;
      border: none;
      border-radius: 2rem;
      cursor: pointer;
      width: 100%;
      max-width: 600px;
      text-decoration: none;
      text-align: center;
    }
  </style>
  
  
  
  
  
  