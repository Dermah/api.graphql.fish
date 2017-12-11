// Welcome to Launchpad!
// Log in to edit and save pads, run queries in GraphiQL on the right.
// Click "Download" above to get a zip with a standalone Node.js server.
// See docs and examples at https://github.com/apollographql/awesome-launchpad

// graphql-tools combines a schema string with resolvers.
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLUpload } from 'apollo-upload-server'

import { createWriteStream } from 'fs'

// Construct a schema, using GraphQL schema language
const typeDefs = `
  type Query {
		allFish: [Fish]
  }

	type Fish {
		name: String
		picture: String
		description: String
  }

  scalar Upload

  type Mutation {
    singleUpload (file: Upload!): String!
    multipleUpload (files: [Upload!]!): [String!]!
  }
`;


const storeUpload = async ({ stream, filename }) => {
  const path = `${filename}`

  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ id: filename, path }))
      .on('error', reject)
  )
}

const processUpload = async upload => {
  const { stream, filename, mimetype, encoding } = await upload
  const { id, path } = await storeUpload({ stream, filename })
  return filename;
  // return recordFile({ id, filename, mimetype, encoding, path })
}

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    allFish: (root, args, context) => {
      return [{
        name: "Goldfish",
        picture: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Goldfish3.jpg",
        description: "Golden, small, forgetful"
      }];
    },
  },
  Upload: GraphQLUpload,
  Mutation: {
    singleUpload: async (obj, { file }) => {
      return await processUpload(file)
    },
    multipleUpload: (obj, { files }) => Promise.all(files.map(processUpload))
  }
};

// Required: Export the GraphQL.js schema object as "schema"
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Optional: Export a function to get context from the request. It accepts two
// parameters - headers (lowercased http headers) and secrets (secrets defined
// in secrets section). It must return an object (or a promise resolving to it).
export function context(headers, secrets) {
  return {
    headers,
    secrets,
  };
};

// Optional: Export a root value to be passed during execution
// export const rootValue = {};

// Optional: Export a root function, that returns root to be passed
// during execution, accepting headers and secrets. It can return a
// promise. rootFunction takes precedence over rootValue.
// export function rootFunction(headers, secrets) {
//   return {
//     headers,
//     secrets,
//   };
// };
