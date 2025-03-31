<template>
  <header>
    <h1>
      <router-link to="/">地道にWeb技術を習得していきたい記録</router-link>
    </h1>
    <p>ちょっとずつ地道に技術習得をしていきます。</p>
  </header>
</template>

<script>
export default {
  name: "AllHeader",
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
header {
  margin: 40px 0;
}
header a {
  color: #333;
  text-decoration: none;
  font-weight: bold;
}
h1 {
  margin: 0 0 20px;
  font-size: 2.1rem;
  text-align: center;
}
p {
  font-size: 1rem;
  text-align: center;
}
</style>
