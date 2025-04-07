import {
    DynamoDBClient,
    PutItemCommand
} from "@aws-sdk/client-dynamodb";
import {
    v4 as uuidv4
} from "uuid";

// DynamoDB client
const client = new DynamoDBClient({
    region: "ap-northeast-1",
    //endpoint: "http://host.docker.internal:8000" // テスト時のみ。本番では外す
});

// HTMLエスケープ
const escapeHTML = (str) => {
    return str.replace(/[&<>'"]/g, (match) => {
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

// バリデーション関数
const validateInput = (data) => {
    const errors = [];

    const checkBlank = (input) => {
        return !!(input && input.trim() !== "");
    };

    const checkName = (input) => {
        if (!checkBlank(input)) return "お名前を入力してください。";
        if (input.length > 30) return "お名前は30文字以下で入力してください。";
        return "";
    };

    const checkMail = (mail, mailReEnter) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (mail.length > 254) return "メールアドレスは254文字以下で入力してください。";
        if (!checkBlank(mail)) return "メールアドレスを入力してください。";
        if (!emailPattern.test(mail)) return "メールアドレスの形式でご入力ください。";
        if (!checkBlank(mailReEnter)) return "メールアドレス再入力を入力してください。";
        if (mail !== mailReEnter) return "メールアドレスが一致しません。";
        return "";
    };

    const checkContent = (input) => {
        if (!checkBlank(input)) return "お問い合わせ内容を入力してください。";
        if (input.length > 200) return "お問い合わせ内容は200文字以下で入力してください。";
        return "";
    };

    const nameError = checkName(data.name);
    const mailError = checkMail(data.mail, data.mailReEnter);
    const contentError = checkContent(data.content);

    if (nameError) errors.push(nameError);
    if (mailError) errors.push(mailError);
    if (contentError) errors.push(contentError);

    return errors;
};

export const handler = async (event) => {
    //本番時プリフライトリクエストのために追加
    console.log(event);
    // CORS対応（プリフライトリクエスト）
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': 'https://yamyamtamtam.tech',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: '',
        };
    }
    try {
        const body = JSON.parse(event.body || "{}");
        const errors = validateInput(body);

        if (errors.length > 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "バリデーションに失敗しました。",
                    errors,
                }),
            };
        }

        const sessionId = uuidv4();
        const sessionData = {
            name: {
                S: escapeHTML(body.name)
            },
            mail: {
                S: escapeHTML(body.mail)
            },
            content: {
                S: escapeHTML(body.content)
            },
            sessionId: {
                S: sessionId
            },
            expireAt: {
                N: String(Math.floor(Date.now() / 1000) + 60 * 10), // 10分後に自動削除
            },
        };

        const command = new PutItemCommand({
            TableName: "ContactSession", // ← テーブル名は適宜変更
            Item: sessionData,
        });

        await client.send(command);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "https://yamyamtamtam.tech", // 本番用
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({
                message: "success",
                sessionId,
            }),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "https://yamyamtamtam.tech", //本番用
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({
                message: "server error"
            }),
        };
    }
};