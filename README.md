# SST/Zero Template
Use SST to deploy a database using Zero and Drizzle, with better-auth integration

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
- `pnpm install`
- `pnpm sso` if you haven't logged in to AWS already
- Set the SST secrets by running `pnpm sst secret set {SecretName} {value}`
  - Check `infra/secret.ts` for the list of secrets you need to set.
  - You'll need to populate the required client IDs and secrets for each social provider in the `infra/secret.ts` file.
    - For GitHub, visit [Github's Developer Settings](https://github.com/settings/developers) and create a new OAuth App.

## Initial infra setup + Local development
- `pnpm sst dev --stage dev` launches the SST multiplexer, which spawns multiple shells into the various dev resources, and creates your infrastructure on the `dev` stage.
  - If its the first time running the dev command, it will take a long time (like 10 minutes) to complete the initial infra deployment.
  - By default, SST creates a new personal stage instead of a stage named `dev`. Adding `--stage dev` to the command will create a stage named `dev` instead. You should verify that after running the command, `.sst/stage` says "dev". Once that is set, you don't have to pass the `--stage` flag to SST commands.
    - You want to initially create a dev stage instead of a personal stage because the personal stages [share resources](https://sst.dev/docs/share-across-stages) created by the dev stage to save money.
  - You'll need to set up the SST Tunnel to access resources in the VPC (the database, etc). Follow the instructions in the SST multiplexer on the "Tunnel" tab to set it up.

## Setting up the DB (Zero + Drizzle)
- This app uses [Zero](https://zero.rocicorp.dev/) to manage data access. Zero talks to an upstream Postgres database, which is managed by Drizzle.
- Upon running `pnpm dev`, you'll see a tab in the SST multiplexer that says `Zero`. Click on it to open a shell into the Zero server container.
- You will likely see that the server ran into a connection error. Idk why, but restarting the process by highlighting the `Zero` tab and pressing `Enter` will fix it.
- Next, you might see an error that the `bet_log` or `bet_log_cvr` db hasn't been created. In this case, you need to seed the DB by running `pnpm --filter scripts db:seed`
- Create the initial Drizzle schema migration by running `pnpm --filter core generate`
- Now that you've created the DB, you need to run Drizzle migrations. Run `pnpm --filter core migrate` to apply the migrations.
- You might have to restart `pnpm dev` after this to get the Zero server to connect to the DB.
- If you see an error from Zero about EADDRINUSE, you might need to manually kill the running process. Zero is in alpha and has some rough edges...
  - On mac:
    - `sudo lsof -i :4849` (or whatever port Zero is running on)
    - See a list of PIDs, copy the first one
    - `kill -9 <PID>`
  - Then try restarting the Zero server.
### Production deployment
- This repo isn't quite set up for prod deploys yet. There are a few `throw new Error()` in the codebase that should catch all the places that need updates to support a prod deployment. Most are just populating the correct env vars for prod.

## Native App
- This template uses [One](https://onestack.dev/) just because thats what my app was using when I made this template.
- The One template includes Tauri to create a native desktop app. I haven't messed with that since I wasn't building a desktop app, so I don't know if it all works. You can remove all the Tauri stuff if you don't want it.
- The Native app runs in dev mode by default when you run `pnpm dev`. Click on the "Native" tab in the SST multiplexer to see details about the dev server.

## Coding style
- Ensure `pnpm typecheck` and `pnpm check` pass. You can run `pnpm fix` to format the code.
  - To use the git hooks in the repo's `.githooks` folder, which will save you from waiting for CI to tell you that you forgot to these commands, run this:
    ```bash
    git config core.hookspath .githooks
    ```
