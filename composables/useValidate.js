export function useValidate() {
    //エラーチェック用
    const errors = useErrors();

    const validate = useState("validate", () => false);
    const name = useState("name", () => "");
    const mail = useState("mail", () => "");
    const mailReEnter = useState("mailReEnter", () => "");
    const content = useState("content", () => "");
    const nameChecked = useState("nameChecked", () => "");
    const mailChecked = useState("mailChecked", () => "");
    const contentChecked = useState("contentChecked", () => "");
    const escapeHTML = (str) => {
        return str.replace(/[&<>'"]/g, function(match) {
            switch (match) {
                case "&":
                    return "&amp;";
                case "<":
                    return "&lt;";
                case ">":
                    return "&gt;";
                case '"':
                    return "&quot;";
                case "'":
                    return "&#39;";
            }
        });
    };
    const checkBlank = (input) => {
        if (input == "") {
            return false;
        } else {
            return true;
        }
    };
    const checkName = (input) => {
        if (!checkBlank(input)) {
            nameChecked.value = "お名前を入力してください。";
            errors.value++;
        } else if (input.length > 30) {
            nameChecked.value = "お名前は30文字以下で入力してください。";
            errors.value++;
        } else {
            nameChecked.value = "";
            errors.value = 0;
        }
    };

    const checkMail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (mail.value.length > 254) {
            mailChecked.value = "メールアドレスは254文字以下で入力してください。";
            errors.value++;
        } else if (!checkBlank(mail.value)) {
            mailChecked.value = "メールアドレスを入力してください。";
            errors.value++;
        } else if (!emailPattern.test(mail.value)) {
            mailChecked.value = "メールアドレスの形式でご入力ください。";
            errors.value++;
        } else if (!checkBlank(mailReEnter.value)) {
            mailChecked.value = "メールアドレス再入力を入力してください。";
            errors.value++;
        } else if (mail.value !== mailReEnter.value) {
            mailChecked.value = "メールアドレスが一致しません。";
            errors.value++;
        } else {
            mailChecked.value = "";
            errors.value = 0;
        }
    };

    const checkContent = (input) => {
        if (!checkBlank(input)) {
            contentChecked.value = "お問い合わせ内容を入力してください。";
            errors.value++;
        } else if (input.length > 200) {
            contentChecked.value =
                "お問い合わせ内容は200文字以下で入力してください。";
            errors.value++;
        } else {
            contentChecked.value = "";
            errors.value = 0;
        }
    };

    const validationPersonal = () => {
        //個人情報のバリデーション
        errors.value = 0;
        checkName(name.value);
        checkMail(mail.value);
        checkContent(content.value);
    };

    return {
        validate,
        name,
        mail,
        mailReEnter,
        content,
        nameChecked,
        mailChecked,
        contentChecked,
        checkName,
        checkMail,
        checkContent,
        escapeHTML,
        checkBlank,
        checkMail,
        validationPersonal,
    };
}