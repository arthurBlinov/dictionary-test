<template>
  <div class="container">
    <div class="container-items">
        <button>Play</button>
        <RouterLink to="/dict">Edit dictionaries</RouterLink>
    </div>
    
  </div>
</template>
<script>

</script>
<style lang="scss">
@import "@/styles/main.scss";

.container {
  background-color: $bg-main;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 600px;
  margin: auto;
}

.container-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  button {
    width: 250px;
    height: 50px;
    border-radius: 30px;
    color: $bg-main;
    font-size: $big-font-size;
    font-weight: 600;
    margin-bottom: 20px; 
  }

  a {
    font-size: 2rem;
    color: $bg-buttons-lists;
    text-decoration: none;
    padding-bottom: 3px; 
    border-bottom: 2px solid $bg-buttons-lists;
    letter-spacing: 1px;
  }
}
</style>
