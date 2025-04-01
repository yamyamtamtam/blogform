import {
    SESClient,
    SendEmailCommand
} from "@aws-sdk/client-ses";
import {
    DynamoDBClient,
    GetItemCommand
} from "@aws-sdk/client-dynamodb";

const REGION = "ap-northeast-1"; // 適宜変更
const TABLE_NAME = "ContactSession";
const TO_ADDRESS = process.env.TO_ADDRESS;

const ses = new SESClient({
    region: REGION
});
const db = new DynamoDBClient({
    region: REGION
});

export const handler = async (event) => {
    try {
        const body = JSON.parse(event.body || "{}");
        const sessionId = body.sessionId;

        if (!sessionId) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "セッションIDが必要です。"
                }),
            };
        }

        const getCommand = new GetItemCommand({
            TableName: TABLE_NAME,
            Key: {
                sessionId: {
                    S: sessionId
                },
            },
        });

        const result = await db.send(getCommand);
        const item = result.Item;

        if (!item) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: "セッションが見つかりません。"
                }),
            };
        }

        const name = item.name.S;
        const mail = item.mail.S;
        const content = item.content.S;

        // 管理者宛メール
        const adminMail = new SendEmailCommand({
            Destination: {
                ToAddresses: [TO_ADDRESS],
            },
            Message: {
                Subject: {
                    Data: "【お問い合わせ】フォームからのメッセージ",
                },
                Body: {
                    Text: {
                        Data: `名前: ${name}\nメール: ${mail}\n内容:\n${content}`,
                    },
                },
            },
            Source: TO_ADDRESS,
            ReplyToAddresses: [mail],
        });

        // ユーザー宛メール
        const userMail = new SendEmailCommand({
            Destination: {
                ToAddresses: [mail],
            },
            Message: {
                Subject: {
                    Data: "【お問い合わせありがとうございます】",
                },
                Body: {
                    Text: {
                        Data: `${name} 様\n\nお問い合わせありがとうございます。\n以下の内容で受け付けました：\n\n----------------\nお名前: ${name}\nメール: ${mail}\n内容:\n${content}\n----------------\n\n担当者より改めてご連絡いたします。\n`,
                    },
                },
            },
            Source: TO_ADDRESS,
            ReplyToAddresses: [TO_ADDRESS],
        });

        await Promise.all([
            ses.send(adminMail),
            ses.send(userMail),
        ]);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "メール送信に成功しました（管理者・ユーザー）"
            }),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "メール送信に失敗しました。"
            }),
        };
    }
};