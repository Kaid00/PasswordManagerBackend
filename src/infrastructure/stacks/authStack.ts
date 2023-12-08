
import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { CfnIdentityPool, CfnIdentityPoolRoleAttachment, CfnUserPoolGroup, UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { FederatedPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';



export class AuthStack extends Stack {
  
    public userPool: UserPool;
    private userPoolClient: UserPoolClient;
    private identityPool: CfnIdentityPool;
    private authenticatedRole: Role;
    private unAuthenticatedRole: Role;
    private adminRole: Role;
    

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        // Cognito components
        this.createUserPool();
        this.createUserPoolClient();
        this.createIdentityPoop();


        this.createRoles();
        this.attachRoles();
        this.createAdminsGroup();

    }

    // Creating UserPool
    private createUserPool(){
        this.userPool = new UserPool(this, 'PasswordManagerUserPool', {
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
    private createUserPoolClient(){
        this.userPoolClient = this.userPool.addClient('PasswordManagerUserPoolClient'), {
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

    private createAdminsGroup(){

        new CfnUserPoolGroup(this, 'PasswordManagerAdmins', {
            userPoolId: this.userPool.userPoolId,
            groupName: 'admins',
            roleArn: this.adminRole.roleArn
        })

      
    }

    private createIdentityPoop() {
        this.identityPool = new CfnIdentityPool(this, 'PasswordManagerIdentityPool', {
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


