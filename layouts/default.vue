<template>
  <div>
    <Header />
    <NuxtPage />
    <Footer />
  </div>
</template>

<script>
import Header from "~/components/global/Header.vue";
import Footer from "~/components/global/Footer.vue";

export default {
  components: {
    Header,
    Footer,
  },
};
</script>

<style scoped>
div {
}
</style>
