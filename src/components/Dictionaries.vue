<template>
        <BodyForAll>
      <ErrorPopup v-if="showErrorPopup" :message="errorMessage" @close="closeErrorPopup" />

      <ul v-if="!loading">
        <li v-if="paginatedDictionaries.length === 0" class="dictionary-item no-dictionaries">
          No dictionaries yet
        </li>
        <li
          v-else
          v-for="dictionary in paginatedDictionaries"
          :key="dictionary.id"
          class="dictionary-item"
        >
          <font-awesome-icon icon="book" class="icon-left" />
          <span class="dictionary-name">{{ dictionary.name }}</span>
          <RouterLink :to="`/add-edit-dictionary/${dictionary.name}`">
            <font-awesome-icon icon="pen" class="icon-right" />
          </RouterLink>
        </li>
      </ul>
      <div v-if="totalPages > 1 && !loading" class="pagination">
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
  
      <RouterLink to="/create-dict" class="add-button">Add New Dictionary</RouterLink>
    </BodyForAll>

  </template>
  
  <script>
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { faBook, faPen } from '@fortawesome/free-solid-svg-icons';
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { initDB, getDictionaries } from '../db/db';
  import BodyForAll from "./partitians/BodyForAll.vue";
  import ErrorPopup from './ErrorPopup.vue';
  
  library.add(faBook, faPen);
  
  export default {
    name: 'DictionaryList',
    components: {
      FontAwesomeIcon,
      BodyForAll,
      ErrorPopup
    },
    data() {
      return {
        dictionaries: [],
        currentPage: 1,
        dictionariesPerPage: 6,
        maxVisiblePages: 3,
        loading: true, 
        showErrorPopup: false,
        errorMessage: '', 
      };
    },
    computed: {
      paginatedDictionaries() {
        const startIndex = (this.currentPage - 1) * this.dictionariesPerPage;
        return this.dictionaries.slice(startIndex, startIndex + this.dictionariesPerPage);
      },
      totalPages() {
        return Math.ceil(this.dictionaries.length / this.dictionariesPerPage);
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
      async loadDictionaries(db) {
        try {
          this.dictionaries = await getDictionaries(db);
        } catch (error) {
          this.errorMessage = error;
          this.showErrorPopup = true;
        } finally {
          this.loading = false; 
        }
      },
    },
    // created() in Vue is a setup function that runs when the component is made 
    // but before it shows up on the page. It’s used for tasks like getting data 
    // or setting initial values before anything appears on the screen, 
    // though it can't yet interact with HTML elements.
    async created() {
      try {
        const db = await initDB();
        await this.loadDictionaries(db);
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
  
    ul {
      list-style: none;
      padding: 0;
      width: 100%;
    }
  
    .dictionary-item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 14px 26px;
      background-color: $bg-buttons-lists;
      color: $black;
      position: relative;
      font-size: $font-size;
  
      &:not(.no-border)::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 5%;
        right: 5%;
        height: 1px;
        background-color: $gray;
      }
    }
  
    .no-dictionaries {
      color: $gray;
      justify-content: center;
      flex-grow: 1;
      text-align: center;
      position: relative;
    }
  
    .icon-left {
      font-size: $font-size;
      color: $gray;
    }
  
    .icon-right {
      font-size: 1.5rem;
      color: $bg-main;
    }
  
    .dictionary-name {
      font-size: 1.6rem;
      text-align: left;
      flex-grow: 1;
      letter-spacing: 1px;
      margin-left: 12px;
    }
  
    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 1rem;
  
      button {
        margin: 0 0.2rem;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
        background: transparent;
        border: 1px solid $bg-main;
        border-radius: 4px;
  
        &.active {
          font-weight: bold;
          background-color: $bg-main;
          color: $white;
        }
  
        &[disabled] {
          cursor: default;
          color: $gray;
        }
      }
    }
  
    .add-button {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 1.8rem;
      color: $bg-buttons-lists;
      background-color: $bg-main;
      border-radius: 30px;
      width: 100%;
      height: 50px;
      cursor: pointer;
      text-decoration: none;
    }
  </style>
  
  
  
  