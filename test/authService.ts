import { CognitoUser } from "@aws-amplify/auth"
import { Amplify, Auth } from "aws-amplify"
import {CognitoIdentityClient} from '@aws-sdk/client-cognito-identity'
import {fromCognitoIdentityPool} from '@aws-sdk/credential-providers'

const awsRegion = 'us-east-1'
Amplify.configure({
    Auth: {
        region: awsRegion, 
        userPoolId: 'us-east-1_K0ZlCx5X0',
        userPoolWebClientId: '3p49nd4hs6fhf7jt6cp9pqa4uh',
        identityPoolId: 'us-east-1:3982da1e-618c-4e46-b690-a4ac83c204eb',
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