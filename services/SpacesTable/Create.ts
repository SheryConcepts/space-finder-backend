import { DynamoDB } from 'aws-sdk';
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import {v4} from 'uuid';

const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient();

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult =  {
        statusCode: 200,
        body: 'hello from DynamdDB'
    }

    const item = (typeof event.body === 'object') ? event.body : JSON.parse(event.body) 
    item.spaceId = v4();

    try {
        await dbClient.put(
            {
                TableName: TABLE_NAME!,
                Item: item,
            } 
        ).promise()
    } catch(error) {
        result.body = error.message
    }

    result.body = JSON.stringify(`Created item with id: ${item.spaceId}`)

    return result
}
