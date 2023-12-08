import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { marshall } from "@aws-sdk/util-dynamodb";
import { parseJSON } from "../shared/utils";
import { randomUUID } from "crypto";
import { validatePasswordEntry } from "../shared/validators";



export async function createPassword(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    const randomId =  randomUUID();
    let requestJSON = parseJSON(event.body);
    requestJSON.id = randomId
    validatePasswordEntry(requestJSON)

    await ddbClient.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,

        Item: marshall(requestJSON)
    }));

    return {
        statusCode: 201,
        body: JSON.stringify({
            status: 'successful',
            message: `Password with id ${requestJSON.id} saved`,
        })
    }
}