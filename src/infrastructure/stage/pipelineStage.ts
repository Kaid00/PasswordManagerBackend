import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { DataStack } from "../stacks/dataStack";
import { LambdaStack } from "../stacks/lambdaStack";
import { AuthStack } from "../stacks/authStack";
import { ApiStack } from "../stacks/apiStack";
import { MonitorStack } from "../stacks/monitorStack";


export class PipelineStage extends Stage {

    constructor(scope: Construct, id: string, props: StageProps) {
        super(scope, id, props)

        const dataStack = new DataStack(this, 'PasswordManagerDataStack', {
            stageName: props.stageName
        })

        const lambdaStack = new LambdaStack(this, 'PasswordManagerLambdaStack', {
            passwordsTable: dataStack.passwordTable,
            stageName: props.stageName
        })
        
        const authStack = new AuthStack(this, 'PasswordManagerAuthStack', {
            stageName: props.stageName
        })
        
        new ApiStack(this, 'PasswordManagerApiStack' + this.stageName, {
            passwordLambdaIntegration: lambdaStack.passwordLambdaIntegration,
            userPool: authStack.userPool,
            stageName: props.stageName
        })

        new MonitorStack(this, 'PasswordManagerMonitorStackCi', {
            stageName: props.stageName
        });


    }
}