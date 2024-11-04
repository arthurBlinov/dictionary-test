<!-- ErrorPopup.vue -->
<template>
    <div v-if="visible" class="overlay">
      <div class="error-popup">
        <p>{{ message }}</p>
        <button @click="close" class="close-button">Close</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ErrorPopup",
    props: ["message"],
    data() {
      return {
        visible: true,
      };
    },
    methods: {
      close() {
        this.visible = false;
        this.$emit("close");
      },
    },
  };
  </script>
  
  <style scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6); 
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .error-popup {
    background-color: white;
    padding: 20px 30px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    text-align: center;
    color: #333;
  }
  
  .error-popup p {
    font-size: 1.1rem;
    margin: 0 0 15px;
    color: #d32f2f; 
  }
  
  .close-button {
    padding: 8px 20px;
    font-size: 1rem;
    color: white;
    background-color: #d32f2f;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .close-button:hover {
    background-color: #b71c1c; 
  }
  </style>
  
  