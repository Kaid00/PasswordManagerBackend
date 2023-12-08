import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { addCorsHeader } from "../shared/utils";
import { JSONError, MissingFieldError } from "../shared/validators";
import { getPassword } from "./getPasswords";
import { createPassword } from "./postPasswords";
import { updatePassword } from "./updatePasswords";
import { deletePassword } from "./deletePasswords";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";


const ddbClient = new DynamoDBClient({});

async function passwordHandler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    let response: APIGatewayProxyResult;

    try {
        switch (event.httpMethod) {
            case 'GET':
                const getResponse = await getPassword(event, ddbClient)
                response = getResponse
                break;
            case 'POST':
                const postResponse = await createPassword(event, ddbClient)
                response = postResponse
                break;
            case 'PUT':
                const putResponse = await updatePassword(event, ddbClient)
                response = putResponse
                break;
            case 'DELETE':
                const deleteResponse = await deletePassword(event, ddbClient)
                response = deleteResponse
                break;
            default:
                break;
        }
    } catch (error) {
        console.error(error)

        if (error instanceof MissingFieldError) {
            return {
                statusCode: 400,
                body: JSON.stringify(error.message)
            }
        }

        if (error instanceof JSONError) {
            return {
                statusCode: 400,
                body: JSON.stringify(error.message)
            }
        }

        return {
            statusCode: 500,
            body: JSON.stringify(error.message)
        }
    }
   
    addCorsHeader(response)
    return response;

}

export {passwordHandler}