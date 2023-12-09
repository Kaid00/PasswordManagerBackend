import * as cdk from 'aws-cdk-lib';
import { CodeBuildStep, CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from './pipelineStage';

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
        ]
      })
    });

    const testingStage = pipeline.addStage(new PipelineStage(this, 'PipelineTestStage', {
      stageName: 'test'
    }));

    testingStage.addPost(new ManualApprovalStep('Manual approval before production'))

    const productionStage = pipeline.addStage(new PipelineStage(this, 'PipelineProductionStage', {
        stageName: 'prod'
      }));

    // testStage.addPre(new CodeBuildStep('unit-tests', {
    //   commands: [
    //     'npm ci',
    //     'npm test'
    //   ]
    // }))

  }
}
