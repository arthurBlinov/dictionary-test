<template>
    <RouterLink @click="handleClick" :to="to" class="delete-button">
      <slot></slot>
    </RouterLink>
  </template>
  
  <script>
  export default {
    name: "DeleteBtn",
    props: {
      to: {
        type: String,
        required: true,
      },
    },
    methods: {
      deleteDictionary(event) {
        event.preventDefault(); 
        this.onClick();
        this.$router.push(this.to); 
      },
      deleteWord(event) {
        event.preventDefault(); 
        this.onClick();
        this.$router.push(this.to);
      }
    },
  };
  </script>
  
  <style scoped lang="scss">
  @import "@/styles/main.scss";
  
  .delete-button {
    margin: auto;
    padding: 10px;
    letter-spacing: 1px;
    font-size: $font-size;
    text-decoration: underline;
    text-underline-offset: 3px;
    color: $bg-main;
    cursor: pointer;
    border: none;
    background: none;
   
  }
  </style>
  