<template>
  <BodyForAll>
    <ErrorPopup v-if="showErrorPopup" :message="errorMessage" @close="closeErrorPopup" />

    <label :for="language1">{{ language1 }}</label>
    <input
      type="text"
      :id="language1"
      v-model="newWord"
      placeholder="Word"
      :class="{ 'input-error': !isNewWordValid }"
    />
    <p v-if="!isNewWordValid" class="error-message">Must be less than 15 characters.</p>
    <label :for="language2">{{ language2 }}</label>
    <input
      type="text"
      :id="language2"
      v-model="newTranslation"
      placeholder="Word"
      :class="{ 'input-error': !isNewTranslationValid }"
    />
    <p v-if="!isNewTranslationValid" class="error-message">Must be less than 15 characters.</p>

    <ButtonsGroup>
      <AddSaveBtn @click="addWord" :disabled="!isFormValid">Add</AddSaveBtn>
      <CancelBtn :to="`/add-edit-dictionary/${language1}/${language2}/${dictionaryID}`">Cancel</CancelBtn>
    </ButtonsGroup>
  </BodyForAll>
</template>

<script>
import { initDB, addWordToDictionary } from '@/db/db';
import BodyForAll from "./partials/BodyForAll.vue";
import ButtonsGroup from './partials/ButtonsGroup.vue';
import AddSaveBtn from './partials/AddSaveBtn.vue';
import CancelBtn from './partials/CancelBtn.vue';
import ErrorPopup from './ErrorPopup.vue';

export default {
  name: 'AddNewWord',
  components: {
    BodyForAll,
    ButtonsGroup,
    AddSaveBtn,
    CancelBtn,
    ErrorPopup
  },
  data() {
    return {
      newWord: '',
      newTranslation: '',
      showErrorPopup: false,
      errorMessage: '', 
    };
  },
  computed: {
    dictionaryID() {
      return this.$route.params.dictID;
    },
    language1() {
      return this.$route.params.dictLang1;
    },
    language2() {
      return this.$route.params.dictLang2;
    },
    isNewWordValid() {
      return this.newWord.length < 15;
    },
    isNewTranslationValid() {
      return this.newTranslation.length < 15;
    },
    isFormValid() {
      return this.isNewWordValid && this.isNewTranslationValid;
    },
  },
  methods: {
    async addWord() {
      if (this.isFormValid && this.newWord && this.newTranslation) {
        try {
          const db = await initDB();
          await addWordToDictionary(db, this.dictionaryID, this.newWord, this.newTranslation);
          this.newWord = '';
          this.newTranslation = '';
          this.$router.push(`/add-edit-dictionary/${this.language1}/${this.language2}/${this.dictionaryID}`);
        } catch (error) {
          this.errorMessage = error.message;
          this.showErrorPopup = true;  
        }
      } else {
        this.errorMessage = "Must be less than 15 characters and include both word and translation";
        this.showErrorPopup = true;
      }
    },
    closeErrorPopup() {
      this.showErrorPopup = false;
    }  
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/main.scss";

label {
  font-size: 1.2rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: $bg-main;
}

input {
  width: 100%;
  padding: 10px;
  font-size: $font-size;
  border: 1px solid gray;
  border-radius: 30px;
  outline: none;
  margin-bottom: 1rem;

  &::placeholder {
    color: $gray;
  }
}

.input-error {
  border-color: $red;
}

.error-message {
  color: $red;
  font-size: 0.9rem;
  margin-top: -10px;
  margin-bottom: 10px;
}
</style>

  
  