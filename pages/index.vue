<template>
  <div class="wrap">
    <main class="post-content">
      <Loader />
      <section id="personalForm" class="mb60 article">
        <h3>お問い合わせ</h3>
        <form class="inner pt40 pb40" ref="formTop">
          <PersonalDataForm />
          <CheckPrivacy />
          <FormButtons
            @submit-all="submitAll"
            @back-reInput="backReInput"
            @to-inquiry="toInquiry"
            @activate-payment="activatePayment"
          />
          <p
            class="formCautionFull mt30"
            v-if="errors != 0 && endMessage == ''"
          >
            入力内容に不備があります。ご確認ください。
          </p>
        </form>
      </section>
      <p v-if="endMessage != ''" class="formCautionFull">
        {{ endMessage }}
      </p>
    </main>
  </div>
</template>

<script setup>
import Header from "~/components/global/Header.vue";
import Footer from "~/components/global/Footer.vue";
import axios from "axios";
import Loader from "~/components/utility/Loader.vue";
import wait from "~/components/utility/wait.js";
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
//フォームトップ用
const formTop = ref(null);
//ローダー
const loader = useLoader();
//エラーチェック用
const errors = useErrors();

const router = useRouter();

//個人情報保護方針に同意するチェック用
const checkPrivacy = useCheckPrivacy();

//メッセージ用
const endMessage = useEndMessage();

//サンクスページへのリダイレクトフラグ
const thanks = ref(false);

//フロント側でのリアルタイムバリデーション（PersonalDataFormコンポーネント）と、確認用画面へ行くときのバリーデションの2重で行う。
// 確認用画面ではサーバー側にデータを送信して、バリデーションし、セッションidをもらうことでAPIの不正利用を防ぐ。
//const apiBaseUrl = "http://localhost:3001"; //ローカル用。本番ではコメントアウト
const apiBaseUrl =
  "https://bm4vlu45n9.execute-api.ap-northeast-1.amazonaws.com/dev"; //本番用。ローカルではコメントアウト
let sessionId = ref("");

const {
  validate,
  name,
  mail,
  mailReEnter,
  content,
  nameChecked,
  mailChecked,
  contentChecked,
} = useValidate();
const { personalData } = usePersonalData();

const validationPersonal = async () => {
  try {
    const res = await axios.post(
      `${apiBaseUrl}/validate`,
      {
        name: name.value,
        mail: mail.value,
        mailReEnter: mailReEnter.value,
        content: content.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return res.data;
  } catch (err) {
    console.log(err);
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      nameChecked.value = errors.find((e) => e.includes("お名前")) || "";
      mailChecked.value = errors.find((e) => e.includes("メール")) || "";
      mailChecked.value = errors.find((e) => e.includes("メール再入力")) || "";
    } else {
      if (err.code === "ERR_NETWORK") {
        console.error("ネットワークエラー", err);
        endMessage.value = "ネットワークエラーが発生しました。";
      } else if (err.code === "ERR_BAD_REQUEST") {
        console.error("不正なリクエスト", err);
        endMessage.value = "不正なリクエストです。";
      } else if (err.code === "ERR_TIMEOUT") {
        console.error("タイムアウト", err);
        endMessage.value = "タイムアウトしました。";
      } else if (err.code === "ERR_BAD_RESPONSE") {
        console.error("不正なレスポンス", err);
        endMessage.value = "不正なレスポンスです。";
      }
    }
    return false;
  }
};

const toInquiry = async () => {
  loader.value = true;
  //フロントでのバリデーション
  let validationResult = false;
  validationResult = await validationPersonal();
  if (validationResult && validationResult.message === "success") {
    //バリデーションOKなら、確認画面へ遷移
    validate.value = true;
    errors.value = 0;
    endMessage.value = "";
    formTop.value?.scrollIntoView({ behavior: "smooth" });
    if (
      validationResult.hasOwnProperty("sessionId") &&
      validationResult.sessionId != null &&
      validationResult.sessionId !== ""
    ) {
      sessionId.value = validationResult.sessionId;
    }
  } else {
    //バリデーションNGなら、エラーメッセージを表示
    console.log("バリデーションエラー", validationResult);
    errors.value = 1;
    if (!endMessage.value) {
      endMessage.value = "入力内容に不備があります。ご確認ください。";
    }
  }
  loader.value = false;
};

const backReInput = async () => {
  loader.value = true;
  await wait(300);
  validate.value = false;
  errors.value = 0;
  endMessage.value = "";
  loader.value = false;
  formTop.value?.scrollIntoView({ behavior: "smooth" });
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
    const response = await axios.post(
      `${apiBaseUrl}/send`,
      {
        sessionId: sessionId.value,
        name: name.value,
        mail: mail.value,
        content: content.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = response.data;

    if (response.status === 200 && data.message === "送信完了") {
      thanks.value = true;
      router.push("/thanks");
    } else {
      throw new Error("送信失敗");
    }
  } catch (error) {
    validate.value = false;
    endMessage.value =
      "メールの送信に失敗しました。お手数おかけしますが、4leafclover1214@gmail.comまでお問い合わせください。";
    console.error("送信エラー", error);
  } finally {
    loader.value = false;
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
  margin: 10px auto;
  color: #f00;
  font-size: 0.8rem;
  padding: 10px;
  border: #f00 1px solid;
  text-align: center;
}
</style>
