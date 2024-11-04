<template>
    <div class="body-container">
      <slot></slot>
    </div>
  </template>
  
  <script>
  export default {
    name: "BodyForAll",
  };
  </script>
  
  <style scoped lang="scss">
  @import "@/styles/main.scss";
  
  .body-container {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    background-color: $bg-edit-dict;
    height: 90vh;
    width: 100%;
  
    &.align-center {
      align-items: center;
    }
  
    &.max-width-100vw {
      max-width: 100vw;
    }
  }
  </style>
  