import { DeleteItemCommand, DynamoDBClient, GetItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { hasAdminGroup } from "../shared/utils";

export async function deletePassword(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    if (!hasAdminGroup(event)) {
        return {
            statusCode: 401,
            body: JSON.stringify(`Not Authorized!`)
        }
    }

    if(event.queryStringParameters && ('id' in event.queryStringParameters)) {

        const passwordId = event.queryStringParameters['id'];

        await ddbClient.send(new DeleteItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                'id': {S: passwordId}
            }
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({
                status: 'successful',
                message: `Deleted password with id ${passwordId}`
            })
    
        }

    }

    return {
        statusCode: 404,
        body: JSON.stringify('Provide right id')
    }
   
}