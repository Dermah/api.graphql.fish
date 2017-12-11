import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { apolloUploadExpress } from 'apollo-upload-server'
import awsServerlessExpress from 'aws-serverless-express';

import * as Schema from './schema';

const PORT = 4000;
const server = express();


const schemaFunction =
  Schema.schemaFunction ||
  function() {
    return Schema.schema;
  };
let schema;
const rootFunction =
  Schema.rootFunction ||
  function() {
    return schema.rootValue;
  };
const contextFunction =
  Schema.context ||
  function(headers, secrets) {
    return Object.assign(
      {
        headers: headers,
      },
      secrets
    );
  };

server.use(cors())

server.use(
  '/graphql',
  bodyParser.json(),
  apolloUploadExpress(/* Options */),
  graphqlExpress(async (request) => {
    if (!schema) {
      schema = schemaFunction(process.env)
    }
    const context = await contextFunction(request.headers, process.env);
    const rootValue = await rootFunction(request.headers, process.env);

    return {
      schema: await schema,
      rootValue,
      context,
      tracing: true,
    };
  })
);

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  query: `# Welcome to GraphiQL

{
  allFish {
    name
    picture
    description
  }
}
`,
}));

// server.listen(PORT, () => {
//   console.log(`GraphQL Server is now running on http://localhost:${PORT}/graphql`);
//   console.log(`View GraphiQL at http://localhost:${PORT}/graphiql`);
// });


// aws-serverless-express proxy
const awsServer = awsServerlessExpress.createServer(server)
const handler = (event, context) => awsServerlessExpress.proxy(awsServer, event, context)
export {handler};
