# Turbodashboardbuddy starter

This is an official starter Turbodashboardbuddy.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turbodashboardbuddy includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@dashboardbuddy/ui`: a stub React component library shared by both `web` and `docs` applications
- `@dashboardbuddy/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@dashboardbuddy/typescript-config`: `tsconfig.json`s used throughout the monodashboardbuddy

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turbodashboardbuddy has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turbodashboardbuddy
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turbodashboardbuddy
pnpm dev
```

### Remote Caching

Turbodashboardbuddy can use a technique known as [Remote Caching](https://turbo.build/dashboardbuddy/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turbodashboardbuddy will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turbodashboardbuddy
npx turbo login
```

This will authenticate the Turbodashboardbuddy CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turbodashboardbuddy to your Remote Cache by running the following command from the root of your Turbodashboardbuddy:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turbodashboardbuddy:

- [Tasks](https://turbo.build/dashboardbuddy/docs/core-concepts/monodashboardbuddys/running-tasks)
- [Caching](https://turbo.build/dashboardbuddy/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/dashboardbuddy/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/dashboardbuddy/docs/core-concepts/monodashboardbuddys/filtering)
- [Configuration Options](https://turbo.build/dashboardbuddy/docs/reference/configuration)
- [CLI Usage](https://turbo.build/dashboardbuddy/docs/reference/command-line-reference)
