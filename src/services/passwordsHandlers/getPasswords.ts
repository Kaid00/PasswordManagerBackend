import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getPassword(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    if(event.queryStringParameters) {
        if ('id' in event.queryStringParameters) {
            
            const passwordId = event.queryStringParameters['id']

            const getItemResponse =  await ddbClient.send(new GetItemCommand({
                TableName: process.env.TABLE_NAME,
                Key: {
                    'id': {
                        S: passwordId
                    }
                }
            }))
            if (getItemResponse.Item) {
                // Unmarshall the item and return a success response
                const unmashalledItem = unmarshall(getItemResponse.Item)
                return {
                    statusCode: 200,
                    body: JSON.stringify(unmashalledItem)
                }
            } else {
                return {
                    statusCode: 404,
                    body: JSON.stringify(`Password with id ${passwordId} not found`)
                }
            }
        } else {
            // Return a 400 response if no ID is provided in the query parameters
            return {
                statusCode: 400,
                body: JSON.stringify('ID REQUIRED')
            }
        }
    }

    const result = await ddbClient.send(new ScanCommand({
        TableName: process.env.TABLE_NAME,
    }));
    const items = result.Items
    const unmashalledItems = items?.map(item => unmarshall(item))

    return {
        statusCode: 200,
        body: JSON.stringify({
            status: 'successful',
            data:unmashalledItems
        })
    }
}