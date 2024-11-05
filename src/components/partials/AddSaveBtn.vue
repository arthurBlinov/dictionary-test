<template>
  <!-- A button component designed to provide an "Add" or "Save" action in forms. 
       It displays a slot to allow flexibility for the button text and emits a "click" 
       event when clicked, enabling other components to trigger specific actions when 
       using this button. -->
  <button type="button">
      <slot></slot> <!-- Slot for customizable content inside the button (e.g., "Add" or "Save") -->
  </button>
</template>

<script>
export default {
name: "AddSaveBtn", 
props: {
  // Props: define attributes that are passed into this component
  disabled: {
    type: Boolean,
    default: false,
  },
},
methods: {
  // Methods: define functions for specific operations
  handleAdd() {
    // Emits a click events when handleAdd is called,
    // allowing the parent component to respond to the click
    this.$emit("click");
  },
  addWord() {
    this.$emit("click");
  },
  updateDictionary() {
    this.$emit("click");
  }
},
};
</script>

<style scoped lang="scss">
@import "@/styles/main.scss";

button {
  width: 100%; 
  padding: 10px;
  font-size: $font-size; 
  border-radius: $border-radius; 
  cursor: pointer; 
  border: none; 
  color: $white; 
  margin-bottom: 1.3rem; 
  background-color: $bg-main;
}
</style>
