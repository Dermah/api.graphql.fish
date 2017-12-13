# api.graphql.fish



This project was created with [Apollo Launchpad](https://launchpad.graphql.com)

You can see the original pad at [https://launchpad.graphql.com/nxxxpj9mx7](https://launchpad.graphql.com/nxxxpj9mx7)

### Quick start guide

```sh
yarn
yarn start
```

Then open `http://localhost:4000/dev/graphiql` in your browser.

### Quick deploy guide

[Install](https://aws.amazon.com/cli) and [Configure](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) the AWS command line.

Once only, create the domain mapping to AWS Lambda:

```sh
yarn sls create_domain
```

Then you can deploy as many updates as you want:

```sh
yarn deploy
```