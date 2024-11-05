<template>
  <BodyForAll>
    <ErrorPopup v-if="showErrorPopup" :message="errorMessage" @close="closeErrorPopup" />
    <form class="dictionary-form" @submit.prevent="handleAdd">
      <label for="language1">Language 1</label>
      <input
        type="text"
        id="language1"
        v-model="language1"
        placeholder="Language"
        :class="{ 'input-error': !isLanguage1Valid }"
      />
      <p v-if="!isLanguage1Valid" class="error-message">Must be less than 15 characters.</p>
      <label for="language2">Language 2</label>
      <input
        type="text"
        id="language2"
        v-model="language2"
        placeholder="Language"
        :class="{ 'input-error': !isLanguage2Valid }"
      />
      <p v-if="!isLanguage2Valid" class="error-message">Must be less than 15 characters.</p>

      <ButtonsGroup>
        <AddSaveBtn @click="handleAdd" :disabled="!isFormValid">Add</AddSaveBtn>
        <CancelBtn to="/dict">Cancel</CancelBtn>
      </ButtonsGroup>
    </form>
  </BodyForAll>
</template>

<script>
import { initDB, addDictionary } from '@/db/db';
import BodyForAll from "./partials/BodyForAll.vue";
import ButtonsGroup from './partials/ButtonsGroup.vue';
import AddSaveBtn from './partials/AddSaveBtn.vue';
import CancelBtn from './partials/CancelBtn.vue';
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
      return this.language1.length < 15;
    },
    isLanguage2Valid() {
      return this.language2.length < 15;
    },
    isFormValid() {
      return this.isLanguage1Valid && this.isLanguage2Valid;
    },
  },
  methods: {
    async handleAdd() {
      try {
        const db = await initDB();
        if (this.language1 && this.language2 && this.isFormValid) {
          await addDictionary(db, this.language1, this.language2); 
          this.$router.push('/dict'); 
        } else {
          this.errorMessage = 'Languages must be added and length must be less then 15';
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
    margin-bottom: 5px;
    color: $black;
    background-color: $white;
    outline: none;

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
    margin-top: 0;
    margin-bottom: 10px;
  }
}
</style>

  