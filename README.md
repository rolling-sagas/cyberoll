# CYBEROLL

The front-end repo of rollingsagas ([dev domain](https://dev.cyberoll.pages.dev/)).
Based on NextJS.

## Install

1. Install nodejs and pnpm
1. Create `.npmrc` for hugeicons, and add the following line: `//registry.npmjs.org/:_authToken=YOUR_NPM_TOKEN`
1. Install dependencies: `pnpm i`
1. Create database: `pnpm wrangler d1 migrations apply rsDb`. You may need login to your Cloudflare via OAuth.
1. Create `.env` file, and input secres here.

## Monitor

Using Firebase to monitor this site.

- [firebase performance dashboard: dev](https://console.firebase.google.com/project/rollingsagas/performance/app/web:MGEwMmRhMTAtZDJiMi00ZGQ4LWJiMGItYjM0NDlhNmRmYmMw/trends?hl=zh-cn)
- [firebase performance dashboard: prod](https://console.firebase.google.com/project/rollingsagas/performance/app/web:ZjZkMTQwNGUtN2RjZS00M2ZhLWJkYzEtYTkwMTE3MTYzMTIz/trends?hl=zh-cn)
