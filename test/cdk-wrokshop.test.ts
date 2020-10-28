import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CdkWorkshop from '../lib/cdk-workshop-stack';

test('DynamoDB Table Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CdkWorkshop.CdkWorkshopStack(app, 'dynamodb-table-exists');
    // THEN
    expectCDK(stack).to(haveResource('AWS::DynamoDB::Table'));
});

test('Lambda Function Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CdkWorkshop.CdkWorkshopStack(app, 'lambda-function-exists');
    // THEN
    expectCDK(stack).to(haveResource('AWS::Lambda::Function'));
})

test('API Gateway Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CdkWorkshop.CdkWorkshopStack(app, 'api-gateway-exists');
    // THEN
    expectCDK(stack).to(haveResource('AWS::ApiGateway::RestApi'));
});