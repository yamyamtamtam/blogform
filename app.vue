<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
import { useHead } from "#imports";

useHead({
  titleTemplate: (title) =>
    title
      ? `${title} | 地道にWeb技術を習得していきたい記録`
      : "地道にWeb技術を習得していきたい記録",
  meta: [
    { name: "charset", content: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { property: "og:url", content: "https://yamyamtamtam.tech" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "地道にWeb技術を習得していきたい記録" },
  ],
  script: [
    {
      async: true,
      src: "https://www.googletagmanager.com/gtag/js?id=UA-228478773-1",
    },
    {
      children: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'UA-228478773-1');
      `,
    },
  ],
});
</script>
<style>
html {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #444;
  font-size: 16px;
}
.wrap {
  width: 90%;
  margin: 0 auto;
}
article {
  width: 100%;
  margin: 0;
}
h2 {
  margin: 0;
  font-size: 1.6rem;
}
.post-content h3 {
margin: 40px 0 20px;
    font-size: 1.1rem;
    line-height: 2;
    letter-spacing: 1px;
    border-bottom: 1px solid #333;
}
.post-content h4 {
  border-left: 2px solid #333;
  padding: 0 0 0 10px;
  margin: 20px 0;
}

.post-content p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.8;
  letter-spacing: 0.1px;
}

</style>
