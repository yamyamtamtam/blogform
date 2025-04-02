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

//フロント側でのリアルタイムバリデーション（PersonalDataFormコンポーネント）と、確認用画面へ行くときのバリーデションの2重で行う。
// 確認用画面ではサーバー側にデータを送信して、バリデーションし、セッションidをもらうことでAPIの不正利用を防ぐ。
const apiBaseUrl = "http://localhost:3001"; //ローカル用。本番ではコメントアウト
let sessionId = ref("");


const { validate, name, mail, content, nameChecked, mailChecked, contentChecked, } = useValidate();
const { personalData } = usePersonalData();

const validationPersonal = async () => {
  try {
    const res = await axios.post(`${apiBaseUrl}/validate`, {
      name: name.value,
      mail: mail.value,
      content: content.value,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(res);
    return res.data;
  } catch (err) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      nameChecked.value = errors.find((e) => e.includes("お名前")) || "";
      mailChecked.value = errors.find((e) => e.includes("メール")) || "";
      contentChecked.value = errors.find((e) => e.includes("お問い合わせ")) || "";
    } else {
      console.error("バリデーション形式不明", err);
    }
    return false;
  }
};

const toInquiry = async () => {
  loader.value = true;
  //フロントでのバリデーション
  let validationResult = false;
  validationResult = await validationPersonal();
  console.log("validationResult", validationResult);
  if (validationResult && validationResult.message === 'success') {
    console.log('ここまで');
    //バリデーションOKなら、確認画面へ遷移
    validate.value = true;
    if (validationResult.hasOwnProperty('sessionId') && validationResult.sessionId != null && validationResult.sessionId !== '') {
      sessionId = validationResult.sessionId;
    }
  } else {
    //バリデーションNGなら、エラーメッセージを表示
    errors.value = 1;
    endMessage.value = "入力内容に不備があります。ご確認ください。";
  }
  loader.value = false;
};

const submitAll = async () => {
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
  loader.value = true;
  errors.value = 0;
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
