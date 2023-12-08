import { SNSEvent } from "aws-lambda";

// Slack webhook URL for sending alerts
const slackWebHookUrl = "https://hooks.slack.com/services/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"

// Lambda function handler for monitoring AWS resources
async function monitorHandler(event: SNSEvent, context) {
    for(const record of event.Records) {
        
        // Send a message to Slack channel using the webhook URL
        await fetch(slackWebHookUrl, {
            method: 'POST',
            body: JSON.stringify({
                "text": `Password manager API 4xx ALARM ${record.Sns.Message}`
            })
        })
    }
}

export { monitorHandler }