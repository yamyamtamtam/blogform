<template>
  <p class="privacyCheck mt60 textC">
    <input
      type="checkbox"
      v-model="checkPrivacy"
      @keydown.enter.prevent="enterPrevent"
    />
    <span>個人情報の提供に同意する</span>
  </p>
</template>

<script setup>
//個人情報保護方針に同意するチェック用
const checkPrivacy = useCheckPrivacy();
</script>

<style scoped></style>
