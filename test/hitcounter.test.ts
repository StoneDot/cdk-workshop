import cdk = require('@aws-cdk/core');
import {expect as expectCDK, haveResource} from "@aws-cdk/assert";
import {HitCounter} from "../lib/hitcounter";
import * as lambda from '@aws-cdk/aws-lambda';


test('DynamoDB Table Created', () => {
    const stack = new cdk.Stack();
    // WHEN
    new HitCounter(stack, 'MyTestConstruct', {
        downstream: new lambda.Function(stack, 'TestFunction', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'lambda.handler',
            code: lambda.Code.fromInline('test')
        })
    });
    // THEN
    expectCDK(stack).to(haveResource("AWS::DynamoDB::Table", {
        KeySchema: [{
            "AttributeName": "path",
            "KeyType": "HASH"
        }],
        AttributeDefinitions: [
            {
                "AttributeName": "path",
                "AttributeType": "S"
            }
        ],
        ProvisionedThroughput: {
            "ReadCapacityUnits": 1,
            "WriteCapacityUnits": 1
        }
    }));
})

test('Lambda Has Environment Variables', () => {
    const stack = new cdk.Stack();
    // WHEN
    new HitCounter(stack, 'MyTestConstruct', {
        downstream: new lambda.Function(stack, 'TestFunction', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'lambda.handler',
            code: lambda.Code.fromInline('test')
        })
    });
    // THEN
    expectCDK(stack).to(haveResource("AWS::Lambda::Function", {
        Environment: {
            Variables: {
                DOWNSTREAM_FUNCTION_NAME: {"Ref": "TestFunction22AD90FC"},
                HITS_TABLE_NAME: {"Ref": "MyTestConstructHits24A357F0"}
            }
        }
    }));
})