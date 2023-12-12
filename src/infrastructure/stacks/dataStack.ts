import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { getSuffixFromStack } from '../../services/shared/utils';

interface DataStackProps extends StackProps {
    stageName?: string

}

export class DataStack extends Stack {
    public readonly passwordTable: ITable

    constructor(scope: Construct, id: string, props?: DataStackProps) {
        super(scope, id, props)

        const suffix = getSuffixFromStack(this)

        this.passwordTable =  new Table(this, 'PasswordsTable_' + props.stageName.toUpperCase(), {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },

            tableName: `PasswordsTable-${suffix}`
        })
    }
}