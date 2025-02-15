# SST/Zero Template
Use SST to deploy a database using Zero and Drizzle

## Cost:
This repo spins up AWS infra that costs money to operate.
  - the VPC Bastion (see [SST's cost breakdown](https://sst.dev/docs/component/aws/vpc#bastion))
  - the hosted Postgres DB (see [SST's cost breakdown](https://sst.dev/docs/component/aws/postgres#cost))

If you just want to try things out, be sure to `sst remove --stage {your stage name}` after so that you remove the costly infra.

## .env
- You'll need to create a `.env` file in the root of the project.
- See `.env.example` for the variables you need to set.

## Setting up SSO + Secrets
- Follow the guide [here](https://v2.sst.dev/setting-up-aws) to create your own AWS account and own the infra.
  - The end result should be that you have a dev profile and SSO session defined in your `~/.aws/config` file. View the guide linked above for more details.
  - Be sure to update your `.env` file with your AWS profile and SSO session.
- `bun install`
- `bun sso` if you haven't logged in to AWS already
- Set the SST secrets by running `bun sst secret set {SecretName} {value} --stage dev`
  - Check `infra/secret.ts` for the list of secrets you need to set.
  - You'll need to populate the required client IDs and secrets for each social provider in the `infra/secret.ts` file.
    - For GitHub, visit [Github's Developer Settings](https://github.com/settings/developers) and create a new OAuth App.

## Initial infra setup + Local development
- `bun sst dev --stage dev` launches the SST multiplexer, which spawns multiple shells into the various dev resources, and creates your infrastructure on the `dev` stage.
  - If its the first time running the dev command, it will take a long time (like 10 minutes) to complete the initial infra deployment.
  - By default, SST creates a new personal stage instead of a stage named `dev`. Adding `--stage dev` to the command will create a stage named `dev` instead. You should verify that after running the command, `.sst/stage` says "dev". Once that is set, you don't have to pass the `--stage` flag to SST commands.
    - You want to initially create a dev stage instead of a personal stage because the personal stages [share resources](https://sst.dev/docs/share-across-stages) created by the dev stage to save money.
  - You'll need to set up the SST Tunnel to access resources in the VPC (the database, etc). Follow the instructions in the SST multiplexer on the "Tunnel" tab to set it up.

## Setting up the DB (Zero + Drizzle)
- The SST dev server must be running to use the DB.
- Create the initial Drizzle schema migration by running `bun --filter=@sst-zero-template/core generate`. This also creates the initial DB on the RDS instance.
- Now that you've created the DB and the migration, you need to run the migration. Run `bun --filter=@sst-zero-template/core migrate` to apply the migrations.
- This app uses [Zero](https://zero.rocicorp.dev/) to manage data access. Zero talks to an upstream Postgres database, which is managed by Drizzle.
- Upon running `bun dev`, you'll see a tab in the SST multiplexer that says `Zero`. Click on it to open a shell into the Zero server container.
- You might see that the server ran into a connection error `ECONNRESET`, or it might hang while setting up permissions. Restarting the process by highlighting the `Zero` tab, pressing `x` to exit, and then pressing `Enter` to restart will fix it.
- If you see an error from Zero about `EADDRINUSE`, you might need to manually kill the running process. I think thats an SST bug....
  - On mac:
    - `sudo lsof -i :4849` (or whatever port Zero is running on)
    - See a list of PIDs, copy the first one
    - `kill -9 <PID>`
  - Then try restarting the Zero server.
- If you need to delete the whole DB, you can run `bun --filter=@sst-zero-template/scripts db:clean`, and then follow these steps again.

## Zero Permissions
Zero permissions are all set to `ANYONE_CAN` in `packages/core/src/zero/schema.ts`. This isn't what you would want in production, so you'll need to set the permissions to something more appropriate for your use case.
More from the docs [here](https://zero.rocicorp.dev/docs/permissions).

### Production deployment
- This repo isn't quite set up for prod deploys yet. There are a few `throw new Error()` in the codebase that should catch all the places that need updates to support a prod deployment. Most are just populating the correct env vars for prod.

## SvelteKit app
- This app uses [SvelteKit](https://kit.svelte.dev/). The deployment is defined in `infra/webapp.ts`.

## Coding style
- Ensure `bun typecheck` and `bun check` pass. You can run `bun fix` to format the code.
  - To use the git hooks in the repo's `.githooks` folder, which will save you from waiting for CI to tell you that you forgot to these commands, run this:
    ```bash
    git config core.hookspath .githooks
    ```
