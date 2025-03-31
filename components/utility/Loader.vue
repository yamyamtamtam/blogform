<template>
  <transition name="showOpacity vanishOpacity">
    <section class="loaderwrap" v-show="loader">
      <div class="loader"><p>loading...</p></div>
    </section>
  </transition>
</template>

<script setup>
const loader = useLoader();
</script>

<style scoped>
.loaderwrap {
  position: fixed;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.9);
}
.loader,
.loader:before,
.loader:after {
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  animation-fill-mode: both;
  animation: load7 1.8s infinite ease-in-out;
}
.loader {
  color: #333;
  font-size: 10px;
  margin: auto auto;
  position: relative;
  text-indent: -9999em;
  transform: translateZ(0);
  animation-delay: -0.16s;
}
.loader:before,
.loader:after {
  content: "";
  position: absolute;
  top: 0;
}
.loader:before {
  left: -3.5em;
  animation-delay: -0.32s;
}
.loader:after {
  left: 3.5em;
}
@keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
</style>
