import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";
import { GraphQLError } from "graphql";

const port = 8000;
const userUrl = "http://localhost:4000/users";
const fruitUrl = "http://localhost:3000/fruits";

const typeDefs = `
  type User {
    id: Int!
    name: String!
  }

  type Fruit {
    id: Int!
    name: String!
    addedBy: Int!
    user: User
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
    fruits: [Fruit!]!
    fruit(id: Int!): Fruit
  }

  type Mutation {
    createUser(name: String!): User!
    updateUser(id: Int!, name: String!): User!
    deleteUser(id: Int!): Boolean!
    createFruit(name: String!, addedBy: Int!): Fruit!
    updateFruit(id: Int!, name: String!, addedBy: Int!): Fruit!
    deleteFruit(id: Int!): Boolean!
  }
`;

async function call(url, body, method = "GET") {
  let response;
  try {
    response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new GraphQLError("Service unavailable");
  }

  if (response.status === 204) return true;

  const data = await response.json();
  if (!response.ok) throw new GraphQLError(data.error);
  return data;
}

const resolvers = {
  Query: {
    users: () => call(userUrl),
    user: (_, { id }) => call('${userUrl}/${id}'),
    fruits: () => call(fruitUrl),
    fruit: (_, { id }) => call('${fruitUrl}/${id}'),
  },
  Mutation: {
    createUser: (_, { name }) => call(userUrl, { name }, "POST"),
    updateUser: (_, { id, name }) => call('${userUrl}/${id}', { name }, "PUT"),
    deleteUser: (_, { id }) => call('${userUrl}/${id}', undefined, "DELETE"),
    createFruit: (_, { name, addedBy }) => call(fruitUrl, { name, addedBy }, "POST"),
    updateFruit: (_, { id, name, addedBy }) => call('${fruitUrl}/${id}', { name, addedBy }, "PUT"),
    deleteFruit: (_, { id }) => call(`${fruitUrl}/${id}`, undefined, "DELETE"),
  },
  Fruit: {
    user: (fruit) => call(`${userUrl}/${fruit.addedBy}`),
  },
};

const gateway = createYoga({ schema: createSchema({ typeDefs, resolvers }) });

createServer(gateway).listen(port, () => console.log(`gateway is on ${port}`));
