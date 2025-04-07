import {
    DynamoDBClient,
    GetItemCommand,
    DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import {
    SESClient,
    SendEmailCommand,
} from "@aws-sdk/client-ses";

// 設定
const REGION = "ap-northeast-1";
const TABLE_NAME = "ContactSession";
const TO_ADDRESS = process.env.TO_ADDRESS;

// DynamoDBクライアント（本番用）
const db = new DynamoDBClient({
    region: REGION
});
// ローカル用（必要に応じて切り替え）
/*
const db = new DynamoDBClient({
    region: REGION,
    endpoint: "http://host.docker.internal:8000"
});
*/

// SESクライアント（本番用）
const ses = new SESClient({
    region: REGION
});

export const handler = async (event) => {
    try {
        const body = JSON.parse(event.body || "{}");
        const {
            sessionId,
            name,
            mail,
            content
        } = body;

        console.log(sessionId, name, mail, content);


        if (!sessionId || !name || !mail || !content) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "リクエストに必要な情報が不足しています。"
                }),
            };
        }

        // セッションの存在チェック
        const getCommand = new GetItemCommand({
            TableName: TABLE_NAME,
            Key: {
                sessionId: {
                    S: sessionId
                }
            },
        });

        const result = await db.send(getCommand);
        if (!result.Item) {
            return {
                statusCode: 403,
                body: JSON.stringify({
                    message: "セッションが無効、または期限切れです。"
                }),
            };
        }

        const adminText = `名前: ${name}\nメール: ${mail}\n内容:\n${content}`;
        const userText = `${name} 様\n\nお問い合わせありがとうございます。\n以下の内容で受け付けました：\n\n----------------\nお名前: ${name}\nメール: ${mail}\n内容:\n${content}\n----------------\n\n担当者より改めてご連絡いたします。\n`;

        // =====================
        // 本番環境：SESで送信
        // =====================
        const adminMail = new SendEmailCommand({
            Destination: {
                ToAddresses: [TO_ADDRESS]
            },
            Message: {
                Subject: {
                    Data: "【お問い合わせ】フォームからのメッセージ"
                },
                Body: {
                    Text: {
                        Data: adminText
                    }
                },
            },
            Source: TO_ADDRESS,
            ReplyToAddresses: [mail],
        });

        const userMail = new SendEmailCommand({
            Destination: {
                ToAddresses: [mail]
            },
            Message: {
                Subject: {
                    Data: "【お問い合わせありがとうございます】"
                },
                Body: {
                    Text: {
                        Data: userText
                    }
                },
            },
            Source: TO_ADDRESS,
            ReplyToAddresses: [TO_ADDRESS],
        });

        await Promise.all([ses.send(adminMail), ses.send(userMail)]);

        // =====================
        // モック環境：ログに出力
        // =====================
        /*
        console.log("送信先（管理者）:", TO_ADDRESS);
        console.log("メール内容（管理者）:", adminText);
        console.log("送信先（ユーザー）:", mail);
        console.log("メール内容（ユーザー）:", userText);
        */

        // セッション削除（再送防止）
        await db.send(new DeleteItemCommand({
            TableName: TABLE_NAME,
            Key: {
                sessionId: {
                    S: sessionId
                }
            },
        }));

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "https://yamyamtamtam.tech", // 本番用
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({
                message: "送信完了"
            }),
        };
    } catch (err) {
        console.error("送信エラー:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "サーバーエラーが発生しました。"
            }),
        };
    }
};