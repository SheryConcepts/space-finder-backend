import { DynamoDB } from 'aws-sdk';
import {APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult, Context} from 'aws-lambda';

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;

const dbClient = new DynamoDB.DocumentClient();

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult =  {
        statusCode: 200,
        body: 'hello from DynamdDB'
    }

    const requestBody = typeof event.body === 'object' ? event.body : JSON.parse(event.body);
    console.log(requestBody)
    const spaceId = event.queryStringParameters?.[PRIMARY_KEY!];

    if (spaceId && requestBody) {
       const requestBodyKey = Object.keys(requestBody)[0]; 
       const requestBodyValue = requestBody[requestBodyKey];

       const updateResult = await dbClient.update({
        TableName: TABLE_NAME!,
        Key: {
            [PRIMARY_KEY!]: spaceId,
        },
        UpdateExpression: "set #zzzNew = :new",
        ExpressionAttributeNames: {
            "#zzzNew": requestBodyKey,
        },
        ExpressionAttributeValues: {
            ":new": requestBodyValue,
        },
        ReturnValues: "UPDATED_NEW"
       }).promise().catch(e => {throw new Error(e)})
       


       result.body = JSON.stringify(updateResult);

    };
       return result
};