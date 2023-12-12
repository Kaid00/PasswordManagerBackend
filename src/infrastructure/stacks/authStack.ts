
import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { CfnIdentityPool, CfnIdentityPoolRoleAttachment, CfnUserPoolGroup, UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { FederatedPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface AuthStackProps extends StackProps {
    stageName?: string

}

export class AuthStack extends Stack {
  
    public userPool: UserPool;
    private userPoolClient: UserPoolClient;
    private identityPool: CfnIdentityPool;
    private authenticatedRole: Role;
    private unAuthenticatedRole: Role;
    private adminRole: Role;
    

    constructor(scope: Construct, id: string, props?: AuthStackProps) {
        super(scope, id, props)

        // Cognito components
        this.createUserPool(props.stageName);
        this.createUserPoolClient(props.stageName);
        this.createIdentityPool(props.stageName);


        this.createRoles();
        this.attachRoles();
        this.createAdminsGroup(props.stageName);

    }

    // Creating UserPool
    private createUserPool(stageName: string){
        this.userPool = new UserPool(this, 'PasswordManagerUserPool_' +  stageName.toUpperCase(), {
            selfSignUpEnabled: true,
            signInAliases: {
                username: true,
                email: true
            }
        });

        // Output User Pool ID
        new CfnOutput(this, 'PasswordManagerUserPoolId', {
            value: this.userPool.userPoolId
        })
    }

    // Creating UserPool Client
    private createUserPoolClient(stageName: string){
        this.userPoolClient = this.userPool.addClient('PasswordManagerUserPoolClient_' + stageName.toUpperCase()) , {
            authFlows: {
                adminUserPassword: true,
                custom: true,
                userPassword: true,
                userSrp: true
            }
        }

        // Output User Pool Client ID
        new CfnOutput(this, 'PasswordManagerUserPoolClientId', {
            value: this.userPoolClient.userPoolClientId
        })
    }

    private createAdminsGroup(stageName: string){

        new CfnUserPoolGroup(this, 'PasswordManagerAdmins_' + stageName.toUpperCase(), {
            userPoolId: this.userPool.userPoolId,
            groupName: 'admins',
            roleArn: this.adminRole.roleArn
        })

      
    }

    private createIdentityPool(stageName: string) {
        this.identityPool = new CfnIdentityPool(this, 'PasswordManagerIdentityPool_' + stageName.toUpperCase(), {
            allowUnauthenticatedIdentities: true,
            cognitoIdentityProviders: [{
                clientId: this.userPoolClient.userPoolClientId,
                providerName: this.userPool.userPoolProviderName
            }]
        })

        new CfnOutput(this, 'PasswordManagerIdentityPoolId', {
           value: this.identityPool.ref
        })
    }
    // Creating IAM roles for authenticated and unauthenticated users
    private createRoles() {
         // Authenticated role for logged-in users
        this.authenticatedRole = new Role(this, 'CognitoDefaultAuthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'authenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        })

        // Unauthenticated role for non-logged-in users
        this.unAuthenticatedRole = new Role(this, 'CognitoDefaultUnauthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'unauthenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        })

         // Admin role with additional permissions for S3
        this.adminRole = new Role(this, 'CognitoAdminRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'authenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        });

        // // Addinf S3 permissions to admin role
        // this.adminRole.addToPolicy(new PolicyStatement({
        //     effect: Effect.ALLOW,
        //     actions: [
        //         's3:PutObject',
        //         's3:PutObjectAcl',

        //     ],
        //     resources: [photosBucket.bucketArn + '/*']
        // }))
        
    }

    // Attaching IAM roles to Cognito Identity Pool
    private attachRoles() {
        new CfnIdentityPoolRoleAttachment(this, 'RolesAttachment', {
            identityPoolId: this.identityPool.ref,
            roles: {
                'authenticated':  this.authenticatedRole.roleArn,
                'unauthenticated': this.unAuthenticatedRole.roleArn
            },
            roleMappings: {
                adminsMapping: {
                    type: 'Token',
                    ambiguousRoleResolution: 'AuthenticatedRole',
                    identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`
                }
            }
        })
    }
}


