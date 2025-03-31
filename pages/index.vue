<template>
  <div class="wrap">
    <main class="post-content">
      <Loader />
      <section id="personalForm" class="mb60 article">
        <h3>お問い合わせ</h3>
        <form class="inner pt40 pb40">
          <PersonalDataForm />
          <CheckPrivacy />
          <FormButtons
            @submit-all="submitAll"
            @back-reInput="backReInput"
            @to-inquiry="toInquiry"
            @activate-payment="activatePayment"
          />
          <p class="formCautionFull mt30" v-if="errors != 0">
            入力内容に不備があります。ご確認ください。
          </p>
        </form>
      </section>
      <p v-if="endMessage != ''" class="inner mb60">
        <span class="formCautionFull">{{ endMessage }}</span>
      </p>
    </main>
  </div>
</template>

<script setup>
import Header from "~/components/global/Header.vue";
import Footer from "~/components/global/Footer.vue";
import axios from "axios";
import Loader from "~/components/utility/Loader.vue";
import PersonalDataForm from "~/components/forms/PersonalDataForm.vue";
import CheckPrivacy from "~/components/forms/CheckPrivacy.vue";
import FormButtons from "~/components/forms/FormButtons.vue";

//meta情報
useSeoMeta({
  title: "お問い合わせ",
  ogTitle: "お問い合わせ | 地道にWeb技術を習得していきたい記録",
  description: "ちょっとずつ地道に技術習得をしていきます。",
  ogDescription: "ちょっとずつ地道に技術習得をしていきます。",
  ogImage: "",
  twitterCard: "summary_large_image",
  twitterImage: "summary_large_image",
  robots: "noindex, nofollow",
});

//ローダー
const loader = useLoader();
//エラーチェック用
const errors = useErrors();

//個人情報保護方針に同意するチェック用
const checkPrivacy = useCheckPrivacy();

//メッセージ用
const endMessage = useEndMessage();

//サンクスページへのリダイレクトフラグ
const thanks = ref(false);

const toInquiry = async () => {
  loader.value = true;
  //フロントでのバリデーション
  let validationResult = false;
  validationResult = await validationPersonal();
  if (validationResult) {
    //バリデーションOKなら、APIを叩く
    await sendMail();
  } else {
    //バリデーションNGなら、エラーメッセージを表示
    errors.value = 1;
    endMessage.value = "入力内容に不備があります。ご確認ください。";
  }
  loader.value = false;
};

const sendMail = async () => {
  try {
    const response = await axios.get(
      "https://ikghifjp9k.execute-api.ap-northeast-1.amazonaws.com/production/mail/?name=" +
        encodeURIComponent(name.value) +
        "&mail=" +
        encodeURIComponent(mail.value),
    );
    const data = response.data;
    if (data.statusCode === 200) {
      thanks.value = true;
      if (thanks.value) {
        window.location.href = "./thanks";
      }
    } else {
      loader.value = false;
      validate.value = false;
      endMessage.value =
        "メールの送信に失敗しました。お手数おかけしますが、4leafclover1214@gamil.comまでお問い合わせください。";
    }
  } catch (error) {
    loader.value = false;
    validate.value = false;
    endMessage.value =
      "メールの送信に失敗しました。お手数おかけしますが、4leafclover1214@gamil.comまでお問い合わせください。";
  }
};
const submitAll = async () => {
  loader.value = true;
  errors.value = 0;
};
</script>

<style scoped>
input:disabled {
  background-color: #fff;
}

.vanishOpacity-leave {
  opacity: 1;
}

.vanishOpacity-leave-active {
  transition: opacity 1s;
}

.showOpacity-enter-from {
  opacity: 0;
}

.vanishOpacity-leave-to {
  opacity: 0;
}

.vanishOpacity-enter-from {
  opacity: 0;
}

.vanishOpacity-enter-active {
  transition: opacity 1s;
}

.vanishOpacity-enter-to {
  opacity: 1;
}
.showOpacity-enter-active {
  transition: opacity 1s ease;
}

.showOpacity-enter-to {
  opacity: 1;
}

.showOpacity-leave {
  opacity: 1;
}

.showOpacity-leave-active {
  transition: opacity 1s ease;
}

.post-content p.formCautionFull {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  color: #f00;
  font-size: 0.8rem;
  margin: 10px 0;
  padding: 10px;
  border: #f00 1px solid;
  text-align: center;
}
</style>
