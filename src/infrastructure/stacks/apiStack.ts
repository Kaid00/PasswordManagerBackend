import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthorizationType, CognitoUserPoolsAuthorizer, Cors, LambdaIntegration, MethodOptions, ResourceOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';

interface ApiStackProps extends StackProps {
    passwordLambdaIntegration: LambdaIntegration,
    userPool: IUserPool;
}

export class ApiStack extends Stack {

    constructor(scope: Construct, id: string, props?: ApiStackProps) {
        super(scope, id, props);

        const api = new RestApi(this, 'PasswordManagerApi');

        // Configuring authorizer with Cognito User Pool
        const authorizer = new CognitoUserPoolsAuthorizer(this, 'PasswordManagerApiAuthorizer', {
            cognitoUserPools: [props.userPool],
            identitySource: 'method.request.header.Authorization'
        });
        authorizer._attachToApi(api);

        const optionsWithAuth: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: authorizer.authorizerId
            }
        }
        // Setting up CORS for the resource
        const optionsWithCors: ResourceOptions = {
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS
            }
        }

        // Adding HTTP methods (GET, POST, PUT, DELETE) 
        const passwordResource = api.root.addResource('password', optionsWithCors);
        passwordResource.addMethod('GET',  props?.passwordLambdaIntegration, optionsWithAuth )
        passwordResource.addMethod('POST',  props?.passwordLambdaIntegration, optionsWithAuth )
        passwordResource.addMethod('PUT',  props?.passwordLambdaIntegration, optionsWithAuth )
        passwordResource.addMethod('DELETE',  props?.passwordLambdaIntegration, optionsWithAuth )


    }
}