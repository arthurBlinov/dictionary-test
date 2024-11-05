<!-- ConfirmationDialog.vue -->
<template>
    <div class="dialog-overlay" v-if="visible">
      <div class="dialog-box">
        <p>{{ message }}</p>
        <div class="dialog-buttons">
          <button @click="confirmDelete" class="delete-btn">Delete</button>
          <button @click="cancelDelete" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
  name: "ConfirmationDialog",
  data(){
    return{
        visible: true
    }
  },
  props: {
    message: {
      type: String,
      default: "Are you sure you want to delete?",
    },
    
  },
  methods: {
    confirmDelete() {
      this.visible = false;
      this.$emit("confirm");
    },
    cancelDelete() {
      this.visible = false;
      this.$emit("cancel");
    }
  }
  };
  </script>
  
  <style scoped lang="scss">
@import "@/styles/main.scss";
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .dialog-box {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    max-width: 300px;
  }
  
  .dialog-buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
  }
  
  .delete-btn {
    background-color: #ff4d4d;
    color: $white;
    padding: 8px 16px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .cancel-btn {
    background-color: #ccc;
    color: $gray;
    padding: 8px 16px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
  </style>
  