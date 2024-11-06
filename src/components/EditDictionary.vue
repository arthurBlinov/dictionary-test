<template>
  <BodyForAll>
    <ErrorPopup v-if="showErrorPopup" :message="errorMessage" @close="closeErrorPopup" />
    <ConfirmationDialog 
      v-if="showConfirmationDialog" 
      message="Are you sure you want to delete this dictionary?" 
      @confirm="confirmDelete" 
      @cancel="cancelDelete"
    />

    <label for="language1">Language 1</label>
    <input
      type="text"
      id="language1"
      v-model="language1"
      placeholder="First language"
      :class="{ 'input-error': !isLanguage1Valid }"
    />
    <p v-if="!isLanguage1Valid" class="error-message">Must be less than 15 characters.</p>
    
    <label for="language2">Language 2</label>
    <input
      type="text"
      id="language2"
      v-model="language2"
      placeholder="Second language"
      :class="{ 'input-error': !isLanguage2Valid }"
    />
    <p v-if="!isLanguage2Valid" class="error-message">Must be less than 15 characters.</p>
   
    <ButtonsGroup>
      <AddSaveBtn @click="updateDictionary" :disabled="!isFormValid">Save</AddSaveBtn>
      <CancelBtn :to="{ name: 'addEditDictionary', params: { dictLang1: dictLang1, dictLang2: dictLang2, dictID: dictID } }">
        Cancel
      </CancelBtn>
      <DeleteBtn to="" @click="showDeleteConfirmation">Delete Dictionary</DeleteBtn>
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
import ConfirmationDialog from './ConfirmationDialog.vue';

export default {
  name: 'EditDictionary',
  components: {
    BodyForAll,
    ButtonsGroup,
    AddSaveBtn,
    DeleteBtn,
    CancelBtn,
    ErrorPopup,
    ConfirmationDialog,
  },
  data() {
    return {
      dictID: this.$route.params.dictID,
      dictLang1: this.$route.params.dictLang1,
      dictLang2: this.$route.params.dictLang2,
      language1: '',
      language2: '',
      showErrorPopup: false,
      errorMessage: '',
      showConfirmationDialog: false, // controls dialog visibility
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
    isLanguage1Valid() {
      return this.language1.length < 15;
    },
    isLanguage2Valid() {
      return this.language2.length < 15;
    },
  },
  async created() {
    try {
      const db = await initDB();
      const dictionary = await getOneDictionary(db, this.dictID);
      
      if (dictionary) {
        this.language1= dictionary.language1;
        this.language2 = dictionary.language2;
      } else {
        this.errorMessage = 'Dictionary not found';
        this.showErrorPopup = true;
      }
    } catch (error) {
      this.errorMessage = error;
      this.showErrorPopup = true;
    }
  },
  methods: {
    async updateDictionary() {
      if (!this.isFormValid && !this.language1.length <= 15 && !this.language2.length <= 15) {
        this.errorMessage = 'Languages must be less than 15 characters each';
        this.showErrorPopup = true;
        return;
      }
      console.log(this.language1, this.language2, this.dictID);
      
      try {
        const db = await initDB();
        if (this.dictID) {
          await updateDictionary(db, this.dictID, this.language1, this.language2);
          this.$router.push(`/add-edit-dictionary/${this.language1}/${this.language2}/${this.dictID}`);
        }
      } catch (error) {
        this.errorMessage = error.message;
        this.showErrorPopup = true;
      }
    },
    
    showDeleteConfirmation() {
      this.showConfirmationDialog = true; // show dialog
    },
    cancelDelete() {
      this.showConfirmationDialog = false; // hide dialog on cancel
    },
    async confirmDelete() {
      this.showConfirmationDialog = false;
      try {
        const db = await initDB();
        if (this.dictID) {
          await deleteDictionary(db, this.dictID);
          this.$router.push('/dict');
        }
      } catch (error) {
        this.errorMessage = error.message;
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

  