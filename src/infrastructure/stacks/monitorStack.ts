import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Alarm, Metric, Unit } from "aws-cdk-lib/aws-cloudwatch";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Topic } from "aws-cdk-lib/aws-sns";
import { LambdaSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";
import { join } from "path";


export class MonitorStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) { 
        super(scope, id, props);

        const webHookLambda = new NodejsFunction(this, 'passwordManagerWebhookLambdaCi', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'monitorHandler',
            entry: (join(__dirname, '..', '..', 'services', 'monitor', 'monitorHandler.ts'))
        })

        // Creating SNS TOPIC
        const alarmTopic = new Topic(this, 'PasswordManagerAlarmTopicCi', {
            displayName: 'PasswordManagerAlarmTopicCi',
            topicName: 'PasswordManagerAlarmTopicCi'
        })
        // Subscribing toolsFinderWebhookLambda to the SNS Topic
        alarmTopic.addSubscription(new LambdaSubscription(webHookLambda));

        // CloudWatch Alarm for 4XX errors in the API Gateway
        const toolsApi4xxAlarm = new Alarm(this, 'passwordManager4xxAlarmCi', {
            metric: new Metric({
                metricName: '4XXError',
                namespace: 'AWS/ApiGateway',
                period: Duration.minutes(1),
                statistic: 'Sum',
                unit: Unit.COUNT,
                dimensionsMap: {
                    "ApiName": "PasswordManagerApiCi"
                }
            }),
            evaluationPeriods: 1,
            threshold: 5,
            alarmName: 'passwordManager4xxAlarmCi'
        });
        // Create SNS Action
        const topicAction = new SnsAction(alarmTopic);

        // Adding SNS Action to the CloudWatch Alarm
        toolsApi4xxAlarm.addAlarmAction(topicAction);
        toolsApi4xxAlarm.addOkAction(topicAction)

    }
}