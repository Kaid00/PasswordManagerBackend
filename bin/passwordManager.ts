import { App } from "aws-cdk-lib";
import { DataStack } from "../src/infrastructure/stacks/dataStack";


const app = new App();

new DataStack(app, 'PasswordManagerDataStack')