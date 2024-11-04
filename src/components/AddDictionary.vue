<template>
    <BodyForAll>
      <ErrorPopup v-if="showErrorPopup" :message="errorMessage" @close="closeErrorPopup" />
      <form class="dictionary-form" @submit.prevent="handleAdd">
        <label for="language1">Language 1</label>
        <input type="text" id="language1" v-model="language1" placeholder="Language" :class="{ 'input-error': !isLanguage1Valid }" />
  
        <label for="language2">Language 2</label>
        <input type="text" id="language2" v-model="language2" placeholder="Language" :class="{ 'input-error': !isLanguage2Valid }"/>
  
        <ButtonsGroup>
          <AddSaveBtn @click="handleAdd" :disabled="!isFormValid">Add</AddSaveBtn>
          <CancelBtn to="/dict">Cancel</CancelBtn>
        </ButtonsGroup>
      </form>
    </BodyForAll>
  </template>
  
  <script>
import { initDB, addDictionary } from '@/db/db'; 
import { validateInput } from './validation/validateInput';
import BodyForAll from "./partitians/BodyForAll.vue";
import ButtonsGroup from './partitians/ButtonsGroup.vue';
import AddSaveBtn from './partitians/AddSaveBtn.vue';
import CancelBtn from './partitians/CancelBtn.vue';
import ErrorPopup from './ErrorPopup.vue';

export default {
  name: 'AddDictionary',
  components: {
    BodyForAll,
    ButtonsGroup,
    AddSaveBtn,
    CancelBtn,
    ErrorPopup
  },
  data() {
    return {
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
  methods: {
    async handleAdd() {
      try {
        const db = await initDB();
        const name = `${this.language1}-${this.language2}`;

        if (this.language1 && this.language2) {
          await addDictionary(db, name); 
          this.$router.push('/dict'); 
        } else {
          this.errorMessage = 'Error occured';
          this.showErrorPopup = true;
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

  
    .dictionary-form {
      width: 100%;
      display: flex;
      flex-direction: column;
  
      label {
        font-size: $font-size;
        margin-top: 10px;
        margin-bottom: 5px;
        color: $gray;
      }
  
      input {
        padding: 10px;
        font-size: $font-size;
        border: 1px solid $gray;
        border-radius: 5px;
        margin-bottom: 15px;
        color: $bg-main;
        background-color: $white;
        outline: none;
  
        &::placeholder {
          color: $gray;
        }
      }
  
      
        
      .input-error {
      border-color: $red;
    }
    }
    

  </style>
  