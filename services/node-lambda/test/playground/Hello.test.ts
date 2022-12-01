import { APIGatewayProxyEvent } from "aws-lambda";
import {handler} from "../../../SpacesTable/Delete"

const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        spaceId: "8f010bc9-90b3-47e2-899a-99d942b23ee9"
    },
} as any

handler(event, {} as any).then(
    (res) => {
        console.log(res)
        const Items = JSON.parse(res.body)
        console.log(123)
    }
)