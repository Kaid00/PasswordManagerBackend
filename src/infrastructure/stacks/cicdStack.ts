import * as cdk from 'aws-cdk-lib';
import { CodeBuildStep, CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from '../stage/pipelineStage';

export class CiCdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'PasswordManagerPipeline', {
      pipelineName: 'PasswordManagerPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('Kaid00/PasswordManagerBackend', 'master'),
        commands: [
          'npm ci',
          'npx cdk synth'
        ],
      })
    });

    const testingStage = pipeline.addStage(new PipelineStage(this, 'PipelineTestStage', {
      stageName: 'test'
    }));

    testingStage.addPre(new CodeBuildStep('Synth', {
        commands: ['./buildspec.yaml'],
    }));

 

    testingStage.addPost(new ManualApprovalStep('Manual approval before production'))

    const productionStage = pipeline.addStage(new PipelineStage(this, 'PipelineProductionStage', {
        stageName: 'prod'
      }));

 

  }
}
