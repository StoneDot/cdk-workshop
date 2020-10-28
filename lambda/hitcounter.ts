import {DynamoDBClient, UpdateItemCommand} from '@aws-sdk/client-dynamodb-node';
import {InvokeCommand, LambdaClient} from '@aws-sdk/client-lambda-node';
import {TextDecoder} from "util";

const clientConfig = {region: 'ap-northeast-1'};

exports.handler = async function (event: { path: any; }) {
    console.log("request:", JSON.stringify(event, undefined, 2));

    const dynamoDB = new DynamoDBClient(clientConfig);
    const lambda = new LambdaClient(clientConfig);

    const updateItemCommand = new UpdateItemCommand({
        TableName: process.env.HITS_TABLE_NAME || '',
        Key: {path: {S: event.path}},
        UpdateExpression: 'ADD hits :incr',
        ExpressionAttributeValues: {':incr': {N: '1'}}
    });

    const invokeCommand = new InvokeCommand({
        FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME || '',
        Payload: JSON.stringify(event)
    });

    await dynamoDB.send(updateItemCommand);
    const resp = await lambda.send(invokeCommand);

    console.log('downstream response:', JSON.stringify(resp, undefined, 2));

    // return response back to upstream caller
    const jsonPayload = new TextDecoder("utf-8").decode(resp.Payload);
    return JSON.parse(jsonPayload);
}