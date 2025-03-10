## Install
1. Install nodejs and pnpm
1. Create `.npmrc` for hugeicons, and add the following line: `//registry.npmjs.org/:_authToken=YOUR_NPM_TOKEN`
1. Install dependencies: `pnpm i`
1. Create database: `pnpm wrangler d1 migrations apply rsDb`. You may need login to your Cloudflare via OAuth. 
1. Create `.env` file, and input secres here.
