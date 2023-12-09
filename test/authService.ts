import { CognitoUser } from "@aws-amplify/auth"
import { Amplify, Auth } from "aws-amplify"
import {CognitoIdentityClient} from '@aws-sdk/client-cognito-identity'
import {fromCognitoIdentityPool} from '@aws-sdk/credential-providers'

const awsRegion = 'us-east-1'
Amplify.configure({
    Auth: {
        region: awsRegion, 
        userPoolId: 'us-east-1_DnkfOEUva',
        userPoolWebClientId: '65e03bepkkkhvavs4hd0erf6fc',
        identityPoolId: 'us-east-1:366470dd-eca1-4730-a703-65291e8e7d70',
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
        const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/us-east-1_DnkfOEUva`;
        const cognitoIdentity = new CognitoIdentityClient({
            credentials: fromCognitoIdentityPool({
                identityPoolId: 'us-east-1:366470dd-eca1-4730-a703-65291e8e7d70',
                logins: {
                    [cognitoIdentityPool]: jwtToken
                }
            })
        });
        const credentials = await cognitoIdentity.config.credentials();
        return credentials;
    }
}