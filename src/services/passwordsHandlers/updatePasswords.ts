import { DynamoDBClient, GetItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function updatePassword(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    if(event.queryStringParameters && ('id' in event.queryStringParameters) && event.body) {
        const parsedBody = JSON.parse(event.body)
        const passwordId = event.queryStringParameters['id'];
        const requestJSONKey = Object.keys(parsedBody)[0];
        const requestJSONValue = event.body[requestJSONKey];

        const updateResult = await ddbClient.send(new UpdateItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                'id': {
                    S: passwordId
                }
            },
            UpdateExpression: 'set #zzzNew = :new',
            ExpressionAttributeValues: {
                ':new': {
                    S: requestJSONValue
                }
            },
            ExpressionAttributeNames: {
                "#zzzNew": requestJSONKey
            },
            ReturnValues: 'UPDATED_NEW'
        }));
         // Return a success response with the updated attributes
        return {
            statusCode: 204,
            body: JSON.stringify(updateResult.Attributes)
        }

    }
    // Return an error response if the necessary parameters are not provided
    return {
        statusCode: 404,
        body: JSON.stringify('Provide right atrribute')
    }
   
}