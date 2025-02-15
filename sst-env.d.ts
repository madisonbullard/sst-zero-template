/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */

declare module "sst" {
  export interface Resource {
    "DbProperties": {
      "ZERO_UPSTREAM_DB_NAME": string
      "connectionString": string
      "type": "sst.sst.Linkable"
    }
    "GithubClientId": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "GithubClientSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "Storage": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "Vpc": {
      "bastion": string
      "type": "sst.aws.Vpc"
    }
    "Webapp": {
      "type": "sst.aws.SvelteKit"
      "url": string
    }
    "Zero": {
      "service": string
      "type": "sst.aws.Service"
      "url": string
    }
    "ZeroAuthSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ZeroDatabase": {
      "database": string
      "host": string
      "password": string
      "port": number
      "type": "sst.aws.Postgres"
      "username": string
    }
  }
}
/// <reference path="sst-env.d.ts" />

import "sst"
export {}