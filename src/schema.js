// Welcome to Launchpad!
// Log in to edit and save pads, run queries in GraphiQL on the right.
// Click "Download" above to get a zip with a standalone Node.js server.
// See docs and examples at https://github.com/apollographql/awesome-launchpad

// graphql-tools combines a schema string with resolvers.
import { makeExecutableSchema } from 'graphql-tools';

// Construct a schema, using GraphQL schema language
const typeDefs = `
  type Query {
    allFish: [Fish]
    fish (index: Int): Fish
  }

	type Fish {
		name: String
		picture: String
		description: String
	}
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    allFish: (root, args, context) => {
      return fish;
    },
    fish: (root, args) => {
      const {index} = args
      console.log(Number.isInteger(index))
      if (Number.isInteger(index)) {
        const fisho = fish[index];
        if (fisho) {
          return fisho
        } else {
          return {
            name: "undefined Fish",
            picture: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/1200px-Unofficial_JavaScript_logo_2.svg.png",
            description: "unable to load at this time. Please check your fishing line and try again"
          }
        }
      } else {
        return fish[
          Math.floor(Math.random() * fish.length)
        ];
      }
    }
  },
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

const fish = [{
  name: "Goldfish",
  picture: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Goldfish3.jpg",
  description: "golden, small, forgetful"
}, {
  name: "Marlin",
  picture: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Atlantic_blue_marlin.jpg",
  description: "hoping you're having a pleasent evening! Thank you! Ok, bye!"
}, {
  name: "Snapper",
  picture: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Red_Snapper.jpg/220px-Red_Snapper.jpg",
  description: "the Uber for fish"
}, {
  name: "Fangtooth Fish",
  picture: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Anoplogaster_cornuta_2.jpg",
  description: "literally the worst. Ugh."
}, {
  name: "Seahorses",
  picture: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Seahorse_Skeleton_Macro_8_-_edit.jpg",
  description: "not even a fish..."
}, {
  name: "Fishburners",
  picture: "https://fishburners.org/wp-content/themes/wp-fishburners-3.1/img/stamp-icon-circle.png",
  description: "a community of like minded fish looking to grow"
}];
