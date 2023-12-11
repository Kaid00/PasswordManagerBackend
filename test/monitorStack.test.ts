import { App } from "aws-cdk-lib";
import { MonitorStack } from "../src/infrastructure/stacks/monitorStack";
import { Capture, Match, Template } from "aws-cdk-lib/assertions";


describe('Initial test suite', () => {

    let monitorStackTemplate: Template;
    beforeAll(() => {
        // Preparing the template
        const testApp = new App({
            outdir: 'cdk.out'
        });
        const monitorStack = new MonitorStack(testApp, 'MonitorStack');
         monitorStackTemplate = Template.fromStack(monitorStack);

    })

    // arrange step: prepare the template
    // act step: qury for the construct
    // assert step: check for construct properties
    test('Monitor Lambda properties', ()=> {
        monitorStackTemplate.hasResourceProperties('AWS::Lambda::Function', {
            Handler: 'index.monitorHandler',
            Runtime: 'nodejs18.x'
        })
        expect(true).toBeTruthy();
    })


    test('SNS topic properties', ()=> {
        monitorStackTemplate.hasResourceProperties('AWS::SNS::Topic', {
            DisplayName: 'PasswordManagerAlarmTopic',
            TopicName: 'PasswordManagerAlarmTopic'
        })

        expect(true).toBeTruthy();
    })

    // Testing using match
    test('SNS subscriptions', ()=> {
        monitorStackTemplate.hasResourceProperties('AWS::SNS::Subscription', 
        Match.objectEquals({
            Protocol: 'lambda',
            TopicArn: {
                Ref: Match.stringLikeRegexp('PasswordManagerAlarmTopic')
            },
            Endpoint: {
                'Fn::GetAtt': [
                    Match.stringLikeRegexp('passwordManagerWebhookLambda'),
                    'Arn'
                ]
            }
        }))

        expect(true).toBeTruthy();
    })

    // Testing using captures
    test('Alarm actions', ()=> {
        const alarmActionsCapture = new Capture()
        monitorStackTemplate.hasResourceProperties('AWS::CloudWatch::Alarm', {
            AlarmActions: alarmActionsCapture
        });

        expect(alarmActionsCapture.asArray()).toEqual([{
            Ref: expect.stringMatching(/^PasswordManagerAlarmTopic/)
        }])
    })
})