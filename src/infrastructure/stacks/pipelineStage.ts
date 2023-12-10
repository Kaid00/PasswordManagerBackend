import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { DataStack } from "./dataStack";
import { LambdaStack } from "./lambdaStack";
import { AuthStack } from "./authStack";
import { ApiStack } from "./apiStack";
import { MonitorStack } from "./monitorStack";


export class PipelineStage extends Stage {

    constructor(scope: Construct, id: string, props: StageProps) {
        super(scope, id, props)

        const dataStack = new DataStack(this, 'PasswordManagerDataStack')

        const lambdaStack = new LambdaStack(this, 'PasswordManagerLambdaStack', {
            passwordsTable: dataStack.passwordTable,
            stageName: props.stageName
        })
        
        const authStack = new AuthStack(this, 'PasswordManagerAuthStack')
        
        new ApiStack(this, 'PasswordManagerApiStack2', {
            passwordLambdaIntegration: lambdaStack.passwordLambdaIntegration,
            userPool: authStack.userPool,
            stageName: props.stageName
        })

        new MonitorStack(this, 'PasswordManagerMonitorStackCi');


    }
}