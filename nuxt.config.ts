// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  app: {
    baseURL: '/contacts/', // S3の`contacts`ディレクトリをベースURLに設定
  },
  /*
  target: 'static',  // 必要に応じて
  build: {
    publicPath: '/t6LiF8qJ/',
  },
  router: {
    base: '/t6LiF8qJ/',
  },
  */
  css: [
    '~/assets/css/common.css',
    '~/assets/css/style.css',
  ]
})
