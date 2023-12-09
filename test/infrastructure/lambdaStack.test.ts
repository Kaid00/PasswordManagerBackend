import { App } from "aws-cdk-lib";
import { MonitorStack } from "../../src/infrastructure/stacks/monitorStack";
import { Capture, Match, Template } from "aws-cdk-lib/assertions";
import { LambdaStack } from "../../src/infrastructure/stacks/lambdaStack";
import { DataStack } from "../../src/infrastructure/stacks/dataStack";


describe('Initial test suite', () => {

    let lambdaStackTemplate: Template;
    beforeAll(() => {
        // Preparing the template
        const testApp = new App({
            outdir: 'cdk.out'
        });
        const dataStack = new DataStack(testApp, 'PasswordManagerDataStack')

        const lambdaStack = new LambdaStack(testApp, 'lambdaStack', {
            passwordsTable: dataStack.passwordTable
        });

        lambdaStackTemplate = Template.fromStack(lambdaStack);

    })
    // Testing properties
    test('Lambda properties', ()=> {
        lambdaStackTemplate.hasResourceProperties('AWS::Lambda::Function', {
            Handler: 'index.passwordHandler',
            Runtime: 'nodejs18.x'
        })
        expect(true).toBeTruthy();
    })


    // test('Lambda role policy', ()=> {
    //     lambdaStackTemplate.hasResourceProperties('AWS::IAM::Policy', {
    //         Properties: {
    //             PolicyDocument: {
    //                 Statement: [
    //                     {
    //                         Action: [
    //                             "dynamodb:DeleteItem",
    //                             "dynamodb:GetItem",
    //                             "dynamodb:PutItem",
    //                             "dynamodb:Scan",
    //                             "dynamodb:UpdateItem"
    //                         ],
    //                         Effect: "Allow",
    //                         Resource: {
    //                             "Fn::ImportValue": "PasswordManagerDataStack:ExportsOutputFnGetAttPasswordsTable4A3A9024Arn5C0C0EE9"
    //                         }
    //                     }
    //                 ],
    //                 Version: "2012-10-17"
    //             },
    //             PolicyName: "PasswordsLambdaServiceRoleDefaultPolicyCB979B83",
    //             Roles: [{
    //                 Ref: "PasswordsLambdaServiceRole8287F273"
    //             }]
    //         }
    //     })

    // })

})


