<template>
  <button
    class="submitButton mt40"
    v-show="checkPrivacy && validate"
    v-on:click.prevent="submitAll()"
  >
    送信する
  </button>
  <button
    class="backButton mt40"
    v-show="checkPrivacy && validate"
    v-on:click.prevent="backReInput()"
  >
    入力し直す
  </button>
  <button
    class="submitButton mt40"
    v-show="checkPrivacy && !validate"
    v-on:click.prevent="toInquiry()"
  >
    確認画面へ進む
  </button>
</template>

<script setup>
//個人情報保護方針に同意するチェック用
const checkPrivacy = useCheckPrivacy();

const { validationPersonal } = usePersonalData();
//個人情報入力用
const { validate } = useValidate();

const emit = defineEmits(["submit-all", "back-reInput", "to-inquiry"]);

const submitAll = () => {
  emit("submit-all");
};

const backReInput = () => {
  emit("back-reInput");
};

const toInquiry = () => {
  emit("to-inquiry");
};
</script>

<style scoped>
.submitButton {
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  padding: 10px 0;
  background: #333;
  color: #fff;
  font-size: 1rem;
  text-align: center;
  text-decoration: none;
  font-weight: 700;
}
.backButton {
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  padding: 10px 0;
  background: #999;
  color: #fff;
  font-size: 1rem;
  text-align: center;
  text-decoration: none;
  font-weight: 700;
}
</style>
