import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";


interface LambdaStackProps extends StackProps {
    passwordsTable: ITable
}

export class LambdaStack extends Stack {
    public readonly passwordLambdaIntegration: LambdaIntegration

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);


        const passwordsLambda = new NodejsFunction(this, 'PasswordsLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'passwordHandler',
            entry: (join(__dirname, '..', '..' ,'services', 'passwordsHandlers','passwordHandler.ts')),
            environment: {
                TABLE_NAME: props.passwordsTable.tableName
            }
        })
   

        passwordsLambda.addToRolePolicy(new PolicyStatement({
          
            effect: Effect.ALLOW,
            resources: [props.passwordsTable.tableArn],
            actions:[
                'dynamodb:PutItem',
                'dynamodb:Scan',
                'dynamodb:GetItem',
                'dynamodb:UpdateItem',
                'dynamodb:DeleteItem'
            ]
        }))


        this.passwordLambdaIntegration = new LambdaIntegration(passwordsLambda)
    }
}
