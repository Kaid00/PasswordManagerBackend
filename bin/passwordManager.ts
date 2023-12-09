import { App } from "aws-cdk-lib";
import { DataStack } from "../src/infrastructure/stacks/dataStack";
import { LambdaStack } from "../src/infrastructure/stacks/lambdaStack";
import { AuthStack } from "../src/infrastructure/stacks/authStack";
import { ApiStack } from "../src/infrastructure/stacks/apiStack";
import { MonitorStack } from "../src/infrastructure/stacks/monitorStack";
import { CiCdStack } from "../src/infrastructure/stacks/cicdStack";


const app = new App();

new CiCdStack(app, 'PasswordManagerPipeline', {
});

const dataStack = new DataStack(app, 'PasswordManagerDataStack')

const lambdaStack = new LambdaStack(app, 'PasswordManagerLambdaStack', {
    passwordsTable: dataStack.passwordTable
})

const authStack = new AuthStack(app, 'PasswordManagerAuthStack')

new ApiStack(app, 'PasswordManagerApiStack', {
    passwordLambdaIntegration: lambdaStack.passwordLambdaIntegration,
    userPool: authStack.userPool
})

new MonitorStack(app, 'PasswordManagerMonitorStack');

