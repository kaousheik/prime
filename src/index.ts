import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import  Express from "express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./services/User/resolvers/UserResolver";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { redis } from "./redis";
import { Container } from "typedi";
import { useContainer } from "typeorm"
// import { PrimeFeedbackResolver } from "./services/User/resolvers/PrimeFeedbackResolver";
import { DepartmentResolver } from "./services/Department/resolvers/DepartmentResolver";
import { PrimeFeedbackResolver } from "./services/User/resolvers/FeedbackResolver";
// import { TaskResolver } from "./services/Task/resolvers/TaskResolver";
useContainer(Container);
const main = async () => {

  await createConnection();

  const schema = await buildSchema({
    resolvers: [
        UserResolver, 
        DepartmentResolver,
        PrimeFeedbackResolver,
        // TaskResolver
    ],
    validate: false,
    container: Container,
  });

  const apolloServer = new ApolloServer({ 
    schema,
    context: ({ req, res }: any) => ({ req, res })
   });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000"
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: "prime",
      secret: "secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
      }
    })
  );

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};
main();