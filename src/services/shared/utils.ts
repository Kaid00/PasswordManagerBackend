import {Fn, Stack} from 'aws-cdk-lib';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { JSONError } from './validators';


export function getSuffixFromStack(stack: Stack) {
    const shortStackId = Fn.select(2, Fn.split('/', stack.stackId));
    const suffix = Fn.select(4, Fn.split('-', shortStackId));
    return suffix;
}


export function addCorsHeader(arg: APIGatewayProxyResult){
    if (!arg.headers) {
        arg.headers = {}
    }
    arg.headers['Access-Control-Allow-Origin'] = '*'
    arg.headers['Access-Control-Allow-Methods'] = '*'

}

export function parseJSON(arg: string) {
    try {
        return JSON.parse(arg);
    } catch (erorr) {
        throw new JSONError(erorr.message)
    }
}

// Check if the user has the 'admins' group in Cognito.
export function hasAdminGroup(event: APIGatewayProxyEvent) {
    const groups = event.requestContext.authorizer?.claims['cognito:groups'];
    if (groups) {
        return (groups as string).includes('admins');
    }
    return false;
}