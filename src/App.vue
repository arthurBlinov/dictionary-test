<template>
  <div>
    <Navbar v-if="showNavbar"/>
    <RouterView />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'App',
  components: {
    Navbar,
  },
  setup() {
    const route = useRoute();

    // Check if Navbar should be shown based on route
    const showNavbar = computed(() => route.name !== 'main');
    return {
      showNavbar,
    };
  },
};
</script>

