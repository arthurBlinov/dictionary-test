<template>
    <button type="button">
      <slot></slot>
    </button>
</template>
<script>

export default {
  name: "AddSaveBtn",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleAdd() {
      this.$emit("click");
    },
    addWord(){
        this.$emit("click")
    },
    updateDictionary(){
        this.$emit("click")
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