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

    try {
        if (event.queryStringParameters) {
            if (PRIMARY_KEY! in event.queryStringParameters) {
                result.body = await queryWithPrimaryPartition(event.queryStringParameters)
            } else {
                result.body = await queryWithSecondaryPartition(event.queryStringParameters)
            }
            }
         else {
            result.body = await scanTable();
        }
    } catch(error) {
        result.body = error.message
    }


    return result
}

async function scanTable(){
        const queryResponse = await dbClient.scan(
            {
                TableName: TABLE_NAME!,
            } 
        ).promise()
            return  JSON.stringify(queryResponse);
}

async function queryWithSecondaryPartition(query: APIGatewayProxyEventQueryStringParameters) {
    const queryKey = Object.keys(query)[0];
    console.log(queryKey);
    const queryValue = query[queryKey];
    console.log(queryValue)
    const queryResponse = await dbClient.scan({
        TableName: TABLE_NAME!,
        IndexName: queryKey,
        // KeyConditionExpression: "#zz = :zzz",
        // ExpressionAttributeNames: {
        //     "#zz": queryKey,
        // },
        // ExpressionAttributeValues: {
        //     ":zzz": queryValue
        // }
    }).promise();
    return JSON.stringify(queryResponse.Items);
}

async function queryWithPrimaryPartition(query: APIGatewayProxyEventQueryStringParameters) {
        const keyValue = query[PRIMARY_KEY!];
        const queryResponse = await dbClient.query({
            TableName: TABLE_NAME!,
            KeyConditionExpression: "#zz = :zzz",
            ExpressionAttributeNames: {
                "#zz": PRIMARY_KEY!,
            },
            ExpressionAttributeValues: {
                ":zzz": keyValue
            }
        }).promise();

        return JSON.stringify(queryResponse.Items)
}