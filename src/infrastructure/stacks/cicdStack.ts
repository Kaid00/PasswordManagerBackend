import * as cdk from 'aws-cdk-lib';
import { CodeBuildStep, CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
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

    // const testStage = pipeline.addStage(new PipelineStage(this, 'PipelineTestStage', {
    //   stageName: 'test'
    // }));

    // testStage.addPre(new CodeBuildStep('unit-tests', {
    //   commands: [
    //     'npm ci',
    //     'npm test'
    //   ]
    // }))

  }
}
