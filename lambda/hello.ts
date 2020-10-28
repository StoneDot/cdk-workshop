export interface Identity {
    cognitoIdentityPoolId?: any;
    accountId?: any;
    cognitoIdentityId?: any;
    caller?: any;
    accessKey?: any;
    sourceIp: string;
    cognitoAuthenticationType?: any;
    cognitoAuthenticationProvider?: any;
    userArn?: any;
    userAgent: string;
    user?: any;
}

export interface RequestContext {
    accountId: string;
    resourceId: string;
    stage: string;
    requestId: string;
    requestTime: string;
    requestTimeEpoch: number;
    identity: Identity;
    path: string;
    resourcePath: string;
    httpMethod: string;
    apiId: string;
    protocol: string;
}

interface ApiGatewayEvent {
    body: string;
    resource: string;
    path: string;
    httpMethod: string;
    isBase64Encoded: boolean;
    queryStringParameters: Map<string, string>;
    multiValueQueryStringParameters: Map<string, Array<string>>;
    pathParameters: Map<string, string>;
    stageVariables: Map<string, string>;
    headers: Map<string, string>;
    multiValueHeaders: Map<string, Array<string>>;
    requestContext: RequestContext;
}

exports.handler = async function (event: ApiGatewayEvent) {
    console.log("request: " + JSON.stringify(event, undefined, 2));
    return {
        statusCode: 200,
        headers: {"Content-Type": "text/plain"},
        body: `Hello, CDK! You've hit ${event.path}\n`
    }
}