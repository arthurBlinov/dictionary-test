<template>
    <nav class="navbar">
      <ErrorPopup v-if="showErrorPopup" :message="errorMessage" @close="closeErrorPopup" />
      <font-awesome-icon
        v-if="showBackArrow"
        icon="arrow-left"
        class="icon-left"
        @click="goBack"
      />
      <div class="title-with-btn">
        <button v-if="showImportExportBtn" @click="showDialog = true" class="import-export-button">
        Import/Export
      </button>
      <h1>{{ shortenedTitle }}</h1>

      </div>
      
      <RouterLink v-if="showPenIcon" :to="`/edit-dictionary/${currentTitle.split(' - ').join('/')}/${dictID}`">
        <font-awesome-icon icon="pen" class="icon-right" />
      </RouterLink>
      <Loading v-if="loading" />
      <div v-if="showDialog" class="dialog-overlay">
        <div class="dialog">
          <h2>Choose an Action</h2>
          <button @click="exportWords" class="dialog-button">Export</button>
          <input type="file" @change="importWords" accept=".txt" />
          <button @click="closeDialog" class="dialog-close">Cancel</button>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { faPen, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { initDB, getWordsByDictionaryId, addWordToDictionary } from '@/db/db';
  import Loading from '@/components/Loading.vue';
  import ErrorPopup from './ErrorPopup.vue';
  
  library.add(faPen, faArrowLeft);
  
  export default {
    name: 'Navbar',
    components: {
      FontAwesomeIcon,
      Loading,
      ErrorPopup
    },

    data() {
      return {
        currentTitle: '',
        showPenIcon: false,
        showImportExportBtn: false,
        showDialog: false,
        loading: false,
        showBackArrow: false,
        showErrorPopup: false,
        errorMessage: '',
        dictID: ''
      };
    },
    watch: {
      $route(to) {
        this.updateTitle(to);
      },
    },
    computed: {
  shortenedTitle() {
    // Check if the current title length exceeds 20 characters
    if (this.currentTitle.length > 20) {
      // Trim and add ellipsis if necessary
      return this.currentTitle.slice(0, 17) + '...';
    }
    // Return the original title if within limit
    return this.currentTitle;
  }
},
    methods: {
      updateTitle(route) {
        if(route.params.dictLang1 && route.params.dictLang2){
            if(route.name === 'addEditDictionary'){
                this.currentTitle = `${route.params.dictLang1} - ${route.params.dictLang2}`;
                this.dictID = `${this.$route.params.dictID}`
                this.showBackArrow = true;
                this.showPenIcon = true;
                this.showImportExportBtn = true;
            }else{
                this.currentTitle = this.getTitleFromRouteName(route.name);
                this.showBackArrow = false;
                this.showPenIcon = false;
                this.showImportExportBtn = false;
            }
        }else{
          
            this.currentTitle = this.getTitleFromRouteName(route.name);
            this.showPenIcon = false;
            this.showImportExportBtn = false;
            this.showBackArrow = false;
            if(this.currentTitle === 'Dictionaries'){
                this.showBackArrow = true;
            }
        }
      },
      getTitleFromRouteName(name) {
        const titles = {
          dictionaries: 'Dictionaries',
          addNewDictionary: 'Add New Dictionary',
          editDictionary: 'Edit Dictionary',
          editWords: 'Edit Word',
          addNewWord: 'Add New Word'
        };
        return titles[name] || '';
      },
      closeDialog() {
        this.showDialog = false;
      },
async exportWords() {
  this.closeDialog();
  this.loading = true;
  try {
    const db = await initDB();
    const words = await getWordsByDictionaryId(db, this.dictID);

    if (!words || words.length === 0) {
      this.loading = false;
      this.showErrorPopup = true;
      this.errorMessage = 'the dictionary must have at least one word'
      return;
    }
    
    // Generate CSV content from words
    const csvContent = words.map((item) => `${item.word},${item.translation}`).join('\n');
    
    // Add the dictionary name at the top of the content
    const dictName = `${this.$route.params.dictLang1}-${this.$route.params.dictLang2}`;
    const fullContent = `${dictName}\n\n${csvContent}`;  // Dictionary name at the top
    
    // Create a Blob and download link
    const blob = new Blob([fullContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${dictName}_words.txt`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  } catch (error) {
    this.errorMessage = error;
    this.showErrorPopup = true;
  } finally {
    this.loading = false;
  }
},


async importWords(event) {
  this.closeDialog();
  this.loading = true;
  const file = event.target.files[0];
  if (!file) {
    this.errorMessage = 'No file selected';
    this.showErrorPopup = true;
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    const content = e.target.result;
    const lines = content.split('\n');

    // const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      const db = await initDB();
      const existingWords = await getWordsByDictionaryId(db, this.dictID);;
      const existingWordsSet = new Set(existingWords.map(word => word.word));

      for (const line of lines) {
        const [word, translation] = line.split(',');

        // Check if too long
        if (word.length > 15 || translation.length > 15) {
          // this.errorMessage = 'Words bigger than 15 letters were not added.';
        //   this.showErrorPopup = true;
        //   await delay(3000);
          continue; // Continue to the next word
        }

        // Trim and check if the word already exists in the dictionary
        if (!existingWordsSet.has(word.trim())) {
          await addWordToDictionary(db, this.dictID, word.trim(), translation.trim());
        }
      }

    } catch (error) {
      this.errorMessage = error;
      this.showErrorPopup = true;
    } finally {
      window.location.reload(); 
      this.loading = false;
    }
  };

  reader.readAsText(file);
},




      goBack() {
        if (this.$route.name === 'dictionaries') {
          this.$router.push({ name: 'main' });
        } else if (this.$route.name === 'addEditDictionary') {
          this.$router.push({ name: 'dictionaries' });
        }
      },
    },
    created() {
      this.updateTitle(this.$route);

    },

  };
  </script>
  
  <style scoped lang="scss">
  @import "@/styles/main.scss";
  
  .navbar {
    background-color: $bg-main;
    height: 10vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    max-width: 600px;
    margin: auto;
    .title-with-btn {
        display: flex;
        flex-direction: column;
        justify-content: space-around; 
        position: absolute; 

        h1 {
        color: $white;
        font-size: 2.1rem;
        letter-spacing: 1px;
      }
      .import-export-button {
        font-size: $small-font-size;
        background-color: #4caf50;
        color: $white;
        border-radius: 4px;
        cursor: pointer;
        width: 7rem;
    }
    }

   
  
    .icon-left {
      position: absolute;
      left: 10px;
      font-size: 1.5rem;
      color: $white;
      cursor: pointer;
    }
  
    .icon-right {
      position: absolute;
      right: 20px;
      font-size: 1.5rem;
      color: $white;
      cursor: pointer;
    }
  
    
  }
  
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .dialog {
    background: $white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    width: 270px;
    height: 120px;

  }
  
  .dialog-button {
    padding: 10px 20px;
    margin: 10px 0;
    background-color: #007bff;
    color: $white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    display: block;
    width: 100%;
  }
  
  .dialog-close {
    background-color: $gray;
    color: $white;
    width: 45px;
    height: 25px;
    border: none;
    font-size: $small-font-size;
    cursor: pointer;
  }
  </style>
  

  