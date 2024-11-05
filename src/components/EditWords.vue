<template>
        <BodyForAll>
          <ErrorPopup v-if="showErrorPopup" :message="errorMessage" @close="closeErrorPopup" />

      <div class="correct-answers-container">
        <div class="correct-answers">
          <span class="results">0/0</span>
          <span>correct answers</span>
        </div>
        <font-awesome-icon class="refresh-icon" :icon="['fas', 'rotate-right']" />
      </div>
      <label :for="language1">{{ language1 }}</label>
      <input
        type="text"
        :id="language1"
        v-model="editableWord"
        :class="{ 'input-error': !isEditableWordValid }"
      />
      <label :for="language2">{{ language2 }}</label>
      <input
        type="text"
        :id="language2"
        v-model="editableTranslation"
        :class="{ 'input-error': !isEditableTranslationValid }"
      />
      <ButtonsGroup>

        <AddSaveBtn @click="updateWord" :disabled="!isFormValid">Save</AddSaveBtn>
        <CancelBtn :to="`/add-edit-dictionary/${dictionaryName}`">Cancel</CancelBtn>
        <DeleteBtn to="" @click="deleteWord">Delete Word</DeleteBtn>
      </ButtonsGroup>

    </BodyForAll>

  </template>
  
  <script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { initDB, updateWordInDictionary, deleteWordFromDictionary } from '@/db/db';
import { validateInput } from './validation/validateInput';
import BodyForAll from "./partials/BodyForAll.vue";
import ButtonsGroup from './partials/ButtonsGroup.vue';
import AddSaveBtn from './partials/AddSaveBtn.vue';
import DeleteBtn from './partials/DeleteBtn.vue';
import CancelBtn from './partials/CancelBtn.vue';
import ErrorPopup from './ErrorPopup.vue';

library.add(faRotateRight);

export default {
  name: 'EditWords',
  components: {
    FontAwesomeIcon,
    BodyForAll,
    ButtonsGroup,
    AddSaveBtn,
    DeleteBtn,
    CancelBtn,
    ErrorPopup
  },
  data() {
    return {
      editableWord: this.$route.params.word,
      editableTranslation: this.$route.params.translation,
      showErrorPopup: false,
      errorMessage: '', 
    };
  },
  computed: {
    dictionaryName() {
      return this.$route.params.dictName;
    },
    language1() {
      return this.dictionaryName ? this.dictionaryName.split('-')[0] : 'Language 1';
    },
    language2() {
      return this.dictionaryName ? this.dictionaryName.split('-')[1] : 'Language 2';
    },
    isEditableWordValid() {
      return validateInput(this.editableWord);
    },
    isEditableTranslationValid() {
      return validateInput(this.editableTranslation);
    },
    isFormValid() {
      return this.isEditableWordValid && this.isEditableTranslationValid;
    },
  },
  methods: {
    async updateWord() {
      if (!this.isFormValid) {
        this.errorMessage = 'Must be less then 15'
        this.showErrorPopup = true;
        return ;
      }

      try {
        const db = await initDB();
        await updateWordInDictionary(
          db,
          this.dictionaryName,
          this.$route.params.word,
          this.$route.params.translation,
          { word: this.editableWord, translation: this.editableTranslation }
        );
        this.$router.push(`/add-edit-dictionary/${this.dictionaryName}`);
      } catch (error) {
        this.errorMessage = error;
        this.showErrorPopup = true;
      }
    },
    async deleteWord() {
      try {
        const db = await initDB();
        await deleteWordFromDictionary(
          db,
          this.dictionaryName,
          this.editableWord,
          this.editableTranslation
        );
        this.$router.push(`/add-edit-dictionary/${this.dictionaryName}`);
      } catch (error) {
        this.errorMessage = error;
        this.showErrorPopup = true;
      }
    },
  },
};
</script>

  
  <style scoped lang="scss">
  @import "@/styles/main.scss";
  
  
  
    .correct-answers-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: $white;
      padding: 5px 15px;
      border-radius: 30px;
      margin-bottom: 1rem;
  
      .refresh-icon {
        font-size: $font-size; 
        color: $bg-main;
        cursor: pointer;
      }
  
      .correct-answers {
        font-size: $font-size;
        color: $black;
        
        .results {
          margin-right: 1.5rem;
          color: $bg-main;

        }
      }
    }
  
    label {
      font-size: $small-font-size;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      color: $bg-main;
    }
  
    input {
      width: 100%;
      padding: 10px;
      font-size: 1rem;
      border: 1px solid $gray;
      border-radius: 5px;
      outline: none;
      margin-bottom: 1rem;
  
      &::placeholder {
        color: $gray;
      }
    }
</style>
  
  
  