<template>
  <dl class="formTextWrap">
    <dt>お名前</dt>
    <dd>
      <input
        class="formText formText--middle mt10"
        type="text"
        placeholder="例) 本多 美苑"
        v-model="name"
        v-show="!personalData"
        @keydown.enter.prevent="enterPrevent"
      />
      <p class="formCheckLabel" v-show="personalData">{{ name }}</p>
      <br />
      <p class="formCaution" v-if="checkName != ''">{{ nameChecked }}</p>
    </dd>
  </dl>
  <dl class="formTextWrap mt40">
    <dt>
      メールアドレス<br /><span
        >※Gmailなどの場合、迷惑メールフォルダにメールが届く場合があります。迷惑メールフィルタ設定の調整をお願いいたします。</span
      >
    </dt>
    <dd>
      <input
        class="formText formText--large mt10"
        type="email"
        placeholder="例) example@gmail.com"
        v-model="mail"
        v-show="!personalData"
        @keydown.enter.prevent="enterPrevent"
      />
      <p class="textSmall mt10">メールアドレス再入力</p>
      <input
        class="formText formText--large mt10"
        type="email"
        placeholder="例) example@gmail.com"
        v-model="mailReEnter"
        v-show="!personalData"
        @keydown.enter.prevent="enterPrevent"
      />
      <p class="formCheckLabel" v-show="personalData">{{ mail }}</p>
      <br />
      <p class="formCaution" v-if="checkMail != ''">{{ mailChecked }}</p>
    </dd>
  </dl>
  <dl class="formTextWrap mt40">
    <dt>お問い合わせ内容</dt>
    <dd>
      <textarea
        class="formText formText--textarea mt10"
        type="text"
        placeholder="例) メールフォームが壊れている"
        v-model="content"
        v-show="!personalData"
        @keydown.enter.prevent="enterPrevent"
      ></textarea>
      <p class="formCheckLabel" v-show="personalData">{{ content }}</p>
      <br />
      <p class="formCaution" v-if="checkContent != ''">{{ contentChecked }}</p>
    </dd>
  </dl>
</template>

<script setup>
//エラーチェック用
const errors = useErrors();

//個人情報入力用
const {
  validate,
  name,
  mail,
  content,
  nameChecked,
  mailChecked,
  contentChecked,
  checkName,
  mailReEnter,
  checkMail,
  checkBlank,
  checkContent,
} = useValidate();

const { personalData } = usePersonalData();

watch(name, (input) => {
  errors.value = 0;
  checkName(input);
});

watch(mail, () => {
  checkMail();
});

watch(mailReEnter, () => {
  checkMail();
});

watch(content, (input) => {
  console.log("input");
  checkContent(input);
});
</script>

<style scoped>
dl dt span {
  display: block;
  font-size: 0.8rem;
  padding: 10px 0 0;
}
.formText {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.formText--middle {
  max-width: 400px;
}
.formText--large {
  max-width: 700px;
}
.formText--textarea {
  height: 400px;
}
.post-content p.formCaution {
  color: #f00;
  font-size: 0.6rem;
  margin: 10px 0;
}
</style>
