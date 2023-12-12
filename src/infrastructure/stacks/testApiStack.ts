import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthorizationType, CognitoUserPoolsAuthorizer, Cors, Deployment, LambdaIntegration, MethodOptions, ResourceOptions, RestApi, Stage } from 'aws-cdk-lib/aws-apigateway';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';



export class TESTApiStack extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const api = new RestApi(this, 'TestAPISTACKapi');

    
        const passwordResource = api.root.addResource('test');
        passwordResource.addMethod('GET')



    }
}