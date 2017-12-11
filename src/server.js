import { graphqlLambda, graphiqlLambda } from 'apollo-server-lambda';
import { processRequest } from 'apollo-upload-server'
import stream from 'stream';

import multipart from 'aws-lambda-multipart-parser';

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


exports.graphqlHandler = (event, context, callback) => {
  const handler = graphqlLambda(async (request) => {
    console.log('hello it me')
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


  if (event.headers["Content-Type"].contains('multipart/form-data; ')) {
    console.log('OH NO IT A BIGGUN');
    // console.log(event)
    // console.log(context);

    // var bodyBuffer = new Buffer(event['body'].toString(),'base64');
    // var boundary = getBoundary(event.headers["Content-Type"]);

    // console.log(boundary)
    // console.log(bodyBuffer)
    // console.log('uh')
    var parts = multipart.parse(event)
    // console.log('hey')
    console.log(parts)
    // console.log(parts[""])

    // Initiate the source
    const bufferStream = new stream.PassThrough();
    // Write your buffer
    bufferStream.end(parts[""].content);
    // Pipe it to something else  (i.e. stdout)
    console.log({
      stream: bufferStream, //(FileStream)
      filename: parts[""].filename,
      mimetype:  parts[""].contentType,
      encoding:  parts[""].type
    })

    event.body = {
      // ...event.body,
      ...JSON.parse(parts.operations),
      variables: {
        // ...event.body.variables,
        // ...JSON.parse(parts.operations).variables
        file: {
          stream: bufferStream, //(FileStream)
          filename: parts[""].filename,
          mimetype:  parts[""].contentType,
          encoding:  parts[""].type
        }
      },
    }
    // { query: 'mutation ($file: Upload!) {\n  singleUpload(file: $file)\n}\n',
    // variables: { file: Promise { [Object] } } }

    for(var i=0;i<parts.length;i++){
        var part = parts[i];
        // console.log(part);
        // will be:
        // { filename: 'A.txt', type: 'text/plain',
        //		data: <Buffer 41 41 41 41 42 42 42 42> }
    }

    // const derp = processRequest(event)
    // console.log(derp)
    // derp.then(thing => console.log(thing)).catch(err => console.error(error))
  }
  console.log(event);
  return handler(event, context, callback);
};


exports.graphiqlHandler = graphiqlLambda({
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
});