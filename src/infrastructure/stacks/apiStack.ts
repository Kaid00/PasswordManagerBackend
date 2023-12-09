import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthorizationType, CognitoUserPoolsAuthorizer, Cors, Deployment, LambdaIntegration, MethodOptions, ResourceOptions, RestApi, Stage } from 'aws-cdk-lib/aws-apigateway';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';

interface ApiStackProps extends StackProps {
    passwordLambdaIntegration: LambdaIntegration,
    userPool: IUserPool;
    stageName?: string

}

export class ApiStack extends Stack {

    constructor(scope: Construct, id: string, props?: ApiStackProps) {
        super(scope, id, props);

        const api = new RestApi(this, 'PasswordManagerApiCi');

        // Configuring authorizer with Cognito User Pool
        const authorizer = new CognitoUserPoolsAuthorizer(this, 'PasswordManagerApiAuthorizerCi', {
            cognitoUserPools: [props.userPool],
            identitySource: 'method.request.header.Authorization'
        });
        authorizer._attachToApi(api);
        
        // Then create an explicit Deployment construct
        const deployment  = new Deployment(this, 'passwordManagerDeploymentCi', { api });

       
        new Stage(this, props.stageName, {
            deployment,
            stageName: props.stageName
        })
        // // And different stages
        // const [devStage, testStage, prodStage] = ['dev', 'test', 'prod'].map(item => 
        // new Stage(this, `${item}_stage`, { deployment, stageName: item }));
        
        // if( props.stageName === 'test') {
        //     new Stage(this, 'test', {
        //         deployment,
        //         stageName: 'test'
        //     })
    
        // } else if (props.stageName === 'prod') {
        //     new Stage(this, 'prod', {
        //         deployment,
        //         stageName: 'prod'
        //     })
        // } 




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