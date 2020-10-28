import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export interface HitCounterProps {
    downstream: lambda.IFunction;
}

export class HitCounter extends cdk.Construct {
    /** allows accessing the counter function */
    public readonly handler: lambda.Function;

    /** the hit counter table */
    public readonly table: dynamodb.Table;

    constructor(scope: cdk.Construct, id: string, props: HitCounterProps) {
        super(scope, id);

        const table = this.table = new dynamodb.Table(this, 'Hits', {
            partitionKey: {name: 'path', type: dynamodb.AttributeType.STRING}
        });

        this.handler = new lambda.Function(this, 'HitCountHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'hitcounter.handler',
            code: lambda.Code.fromAsset('lambda'),
            environment: {
                DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
                HITS_TABLE_NAME: table.tableName,
            }
        });

        table.grantReadWriteData(this.handler);
    }
}