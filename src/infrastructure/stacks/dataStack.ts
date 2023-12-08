import { Construct } from 'constructs';
import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { getSuffixFromStack } from '../../services/shared/utils';

export class DataStack extends Stack {
    public readonly passwordTable: ITable

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        const suffix = getSuffixFromStack(this)

        this.passwordTable =  new Table(this, 'PasswordsTable', {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },

            tableName: `PasswordsTable-${suffix}`
        })
    }
}