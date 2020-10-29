import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import {SimpleSynthAction, CdkPipeline} from "@aws-cdk/pipelines";
import {WorkshopPipelineStage} from "./pipeline-stage";

export class WorkshopPipelineStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // This creates a new CodeCommit repository called 'WorkshopRepo'
        const repo = new codecommit.Repository(this, 'WorkshopRepo', {
            repositoryName: 'WorkshopRepo'
        });

        // Defines the artifact representing the sourcecode
        const sourceArtifact = new codepipeline.Artifact();
        // Defines the artifact representing the cloud assembly
        // (cloudformation template + all other assets)
        const cloudAssemblyArtifact = new codepipeline.Artifact();

        // The basic pipeline declaration. This sets the initial structure
        // of our pipeline
        const pipeline = new CdkPipeline(this, 'Pipeline', {
            pipelineName: 'WorkshopPipeline',
            cloudAssemblyArtifact,

            // Generate the source artifact from the repo we created.
            sourceAction: new codepipeline_actions.CodeCommitSourceAction({
                actionName: 'CodeCommit',
                output: sourceArtifact,
                repository: repo
            }),

            synthAction: SimpleSynthAction.standardNpmSynth({
                sourceArtifact,
                cloudAssemblyArtifact,
                buildCommand: 'npm run build'
            })
        });

        const deploy = new WorkshopPipelineStage(this, 'Deploy');
        pipeline.addApplicationStage(deploy);
    }
}