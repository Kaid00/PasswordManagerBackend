import { CognitoUser } from "@aws-amplify/auth"
import { Amplify, Auth } from "aws-amplify"
import {CognitoIdentityClient} from '@aws-sdk/client-cognito-identity'
import {fromCognitoIdentityPool} from '@aws-sdk/credential-providers'

const awsRegion = 'us-east-1'
Amplify.configure({
    Auth: {
        region: awsRegion, 
        userPoolId: 'us-east-1_eQRQ8coKh',
        userPoolWebClientId: '6f2dkbg7bvr55q0dco4oke3ef9',
        identityPoolId: 'us-east-1:ee9012e2-9f9a-4fc6-8f3b-975b79528902',
        authenticationFlowType: 'USER_PASSWORD_AUTH'
    }
});

export class AuthService {
    public async login(userName: string, password: string) {
        const result = await Auth.signIn(userName, password) as CognitoUser;
        return result;
    }

    public async generateTemporaryCredentials(user: CognitoUser) {
        const jwtToken = user.getSignInUserSession().getIdToken().getJwtToken();
        const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/us-east-1_eQRQ8coKh`;
        const cognitoIdentity = new CognitoIdentityClient({
            credentials: fromCognitoIdentityPool({
                identityPoolId: 'us-east-1:ee9012e2-9f9a-4fc6-8f3b-975b79528902',
                logins: {
                    [cognitoIdentityPool]: jwtToken
                }
            })
        });
        const credentials = await cognitoIdentity.config.credentials();
        return credentials;
    }
}