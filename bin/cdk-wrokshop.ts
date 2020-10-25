#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkWrokshopStack } from '../lib/cdk-wrokshop-stack';

const app = new cdk.App();
new CdkWrokshopStack(app, 'CdkWrokshopStack');
