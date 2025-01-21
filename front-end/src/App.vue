<template>
  <div id="app">
    <Header v-if="isLoggedIn" />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
  components: {
    Header, Footer
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('username');
    },
  },
};
</script>