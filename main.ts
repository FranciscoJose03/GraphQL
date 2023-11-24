import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { graphSchema } from "./gpl/graphSchema.ts"
import { rQuery } from "./gpl/query.ts";
import { rMutation } from "./gpl/mutation.ts";
import mongoose from "mongoose";
/*
const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}

await mongoose.connect(MONGO_URL);
*/
const resolvers = {
  Query: rQuery,
  Mutation: rMutation
}

const server = new ApolloServer({
  typeDefs: graphSchema,
  resolvers
});

const {url} = await startStandaloneServer(server);

console.log(`Server ready at ${url}`);
