<template>
  <button @click="showDeleteConfirmation" class="delete-button">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "DeleteBtn",
  props:{
    to:{
      type: String,
      required: true
    }
  },
  methods: {
    showDeleteConfirmation(event) {
      event.preventDefault();
      this.$emit("click"); 
    }
  }
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

  