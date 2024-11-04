<template>
    <div :class="['button-group', additionalClass]">
      <slot></slot>
    </div>
  </template>
  
  <script>
  export default {
    name: "ButtonGroup",
    props: {
      additionalClass: {
        type: String,
        default: "",
      },
    },
  };
  </script>
  
  <style scoped lang="scss">
  .button-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    margin-top: 20px;
  }
  </style>