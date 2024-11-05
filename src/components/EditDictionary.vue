<template>
    <BodyForAll>
      <ErrorPopup v-if="showErrorPopup" :message="errorMessage" @close="closeErrorPopup" />
      <label for="language1">Language 1</label>
      <input
        type="text"
        id="language1"
        v-model="language1"
        placeholder="Enter first language"
        :class="{ 'input-error': !isLanguage1Valid }"
      />
      <label for="language2">Language 2</label>
      <input
        type="text"
        id="language2"
        v-model="language2"
        placeholder="Enter second language"
        :class="{ 'input-error': !isLanguage2Valid }"
      />
      <ButtonsGroup>
        <AddSaveBtn @click="updateDictionary" :disabled="!isFormValid">Save</AddSaveBtn>
        <CancelBtn :to="{ name: 'addEditDictionary', params: { dictName: dictionaryName } }">
          Cancel
        </CancelBtn>
        <DeleteBtn to="" @click="deleteDictionary">Delete Dictionary</DeleteBtn>
      </ButtonsGroup>
    </BodyForAll>

  </template>
  
  
  <script>
  import { initDB, getOneDictionary, updateDictionary, deleteDictionary } from '@/db/db';
  import { validateInput } from './validation/validateInput';
  import BodyForAll from "./partials/BodyForAll.vue";
  import ButtonsGroup from './partials/ButtonsGroup.vue';
  import AddSaveBtn from './partials/AddSaveBtn.vue';
  import DeleteBtn from './partials/DeleteBtn.vue';
  import CancelBtn from './partials/CancelBtn.vue';
  import ErrorPopup from './ErrorPopup.vue';
  
  export default {
    name: 'EditDictionary',
    components: {
      BodyForAll,
      ButtonsGroup,
      AddSaveBtn,
      DeleteBtn,
      CancelBtn,
      ErrorPopup
    },
    data() {
      return {
        dictionaryId: null,
        dictionaryName: this.$route.params.dictName, 
        language1: '',
        language2: '',
        showErrorPopup: false,
        errorMessage: '', 
      };
    },
    computed: {
      isLanguage1Valid() {
        return validateInput(this.language1);
      },
      isLanguage2Valid() {
        return validateInput(this.language2);
      },
      isFormValid() {
        return this.isLanguage1Valid && this.isLanguage2Valid;
      },
    },
    async created() {
      try {
        const db = await initDB();
        const dictionary = await getOneDictionary(db, this.dictionaryName);
        if (dictionary) {
          this.dictionaryId = dictionary.id;
          [this.language1, this.language2] = dictionary.name.split('-');
        } else {
          this.errorMessage = 'Not found'
          this.showErrorPopup = true;
        }
      } catch (error) {
        this.errorMessage = error;
        this.showErrorPopup = true;
      }
    },
    methods: {
      async updateDictionary() {
        if (!this.isFormValid) {
          this.errorMessage = 'Must be less then 15'
          this.showErrorPopup = true;
          return ;
        }
        
        try {
          const db = await initDB();
          const updatedName = `${this.language1}-${this.language2}`;
          if (this.dictionaryId) {
            await updateDictionary(db, this.dictionaryId, updatedName);
            this.$router.push(`/add-edit-dictionary/${updatedName}`);
          }
        } catch (error) {
          this.errorMessage = error;
          this.showErrorPopup = true;
        }
      },
      async deleteDictionary() {
        try {
          const db = await initDB();
          if (this.dictionaryId) {
            await deleteDictionary(db, this.dictionaryId);
            this.$router.push('/dict');
          }
        } catch (error) {
          this.errorMessage = error;
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
      font-size: $font-size;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      color: $gray;
    }
  
    input {
      width: 100%;
      padding: 10px;
      font-size: $font-size;
      border: 1px solid $gray;
      border-radius: 5px;
      outline: none;
      margin-bottom: 1rem;
      color: $gray;
      &::placeholder {
        color: $gray;
      }
    }
    .input-error {
      border-color: $red;
    }
  </style>
  