<template>
    <RouterLink :to="to" class="cancel-button">
      <slot></slot>
    </RouterLink>
  </template>
  
  <script>
  export default {
    name: "CancelBtn",
    props: {
      to: {
        type: String,
        required: true,
      },
    },
    methods: {
        handleCancel(event) {
            event.preventDefault(); //This prevents the default behavior of the button or link.
            this.onClick(); //This calls a parent component’s event listener for @click, requires it
            this.$router.push(this.to); //Navigates to the specified route path
        }
    }
  };
  </script>
  
  <style scoped lang="scss">
  @import "@/styles/main.scss";
  
  .cancel-button {
    padding: 10px 20px;
    font-size: $font-size;
    color: $bg-main;
    background-color: transparent;
    border-radius: 30px;
    text-align: center;
    flex: 1;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border: $bg-main solid 1px;
    width: 100%;
    cursor: pointer;
    margin-bottom: 1.3rem;
}
  </style>
  