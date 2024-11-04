<template>
    <BodyForAll>
      <ErrorPopup v-if="showErrorPopup" :message="errorMessage" @close="closeErrorPopup" />
      <label :for="language1">{{ language1 }}</label>
      <input
        type="text"
        :id="language1"
        v-model="newWord"
        placeholder="Enter word"
        :class="{ 'input-error': !isNewWordValid }"
      />
  
      <label :for="language2">{{ language2 }}</label>
      <input
        type="text"
        :id="language2"
        v-model="newTranslation"
        placeholder="Enter translation"
        :class="{ 'input-error': !isNewTranslationValid }"
      />
      <ButtonsGroup>

        <AddSaveBtn @click="addWord" :disabled="!isFormValid">Add</AddSaveBtn>
        <!-- :to binding allows dynamic values for the to attribute, 
         which can change based on the component’s data or computed properties. -->
        <CancelBtn :to="`/add-edit-dictionary/${dictionaryName}`">Cancel</CancelBtn>
      </ButtonsGroup>

    </BodyForAll>
  </template>
  
  <script>
  import { initDB, addWordToDictionary } from '@/db/db';
  import { validateInput } from './validation/validateInput';
  import BodyForAll from "./partitians/BodyForAll.vue";
  import ButtonsGroup from './partitians/ButtonsGroup.vue';
  import AddSaveBtn from './partitians/AddSaveBtn.vue';
  import CancelBtn from './partitians/CancelBtn.vue';
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
      dictionaryName() {
        return this.$route.params.dictName;
      },
      language1() {
        return this.dictionaryName ? this.dictionaryName.split('-')[0] : 'Language 1';
      },
      language2() {
        return this.dictionaryName ? this.dictionaryName.split('-')[1] : 'Language 2';
      },
      isNewWordValid() {
        return validateInput(this.newWord);
      },
      isNewTranslationValid() {
        return validateInput(this.newTranslation);
      },
      isFormValid() {
        return this.isNewWordValid && this.isNewTranslationValid;
      },
    },
    methods: {
      async addWord() {
        if (this.isFormValid) {
          try {
            const db = await initDB();
            await addWordToDictionary(db, this.dictionaryName, this.newWord, this.newTranslation);
            this.newWord = '';
            this.newTranslation = '';
            this.$router.push(`/add-edit-dictionary/${this.dictionaryName}`);
          } catch (error) {
            this.errorMessage = error;
            this.showErrorPopup = true;  
          }
        } else {
          this.errorMessage = "Must be less then 15";
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
    
      
  </style>
  
  