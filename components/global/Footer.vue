<template>
  <footer>
    <a target="_blank" href="https://github.com/yamyamtamtam">GitHub</a>
    <h6>yamyamtamtam All right reserved.</h6>
  </footer>
</template>

<script>
export default {
  name: "AllFooter",
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
footer {
  margin: 40px 0 0;
}
a {
  position: relative;
  display: block;
  width: 160px;
  padding: 10px 20px;
  margin: 0 auto;
  background: #ddd;
  color: #333;
  text-decoration: none;
  text-align: center;
  font-weight: bold;
}
a:after {
  content: ">";
  position: absolute;
  top: 30%;
  right: 10px;
  margin: auto 0;
  font-size: 0.8rem;
}
h6 {
  padding: 10px 0 20px;
  text-align: center;
}
</style>
