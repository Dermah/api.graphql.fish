import { graphqlLambda, graphiqlLambda } from 'apollo-server-lambda';

import * as Schema from './schema';


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


exports.graphqlHandler = function(event, context, callback) {
  const callbackFilter = function(error, output) {
    output.headers['Access-Control-Allow-Origin'] = '*';
    callback(error, output);
  };

  const handler = graphqlLambda(async (request) => {
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
  });

  return handler(event, context, callbackFilter);
};


exports.graphiqlHandler = graphiqlLambda((event) => {
  const stage = event.requestContext.stage;
  return {
    endpointURL: `${event.isOffline === true ? '/' + stage : ''}/graphql`,
    query: `# Welcome to GraphiQL

{
  allFish {
    name
    picture
    description
  }
}
`,
  }
});