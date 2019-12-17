import '@babel/polyfill';
import { ApolloServer, gql } from 'apollo-server';
import { createPool } from 'mysql2/promise'
import { DatabasePool } from './libs/DatabasePool';
import { AppSchema, AppResolvers } from './graphql/Schema';

let setting;
if (process.env.setting) {
  setting = JSON.parse(process.env.setting);
} else {
  setting = require('./setting.js');
}

const pool_rs = createPool({ ...setting.db_rs, namedPlaceholders: true });

const server = new ApolloServer({
  typeDefs: AppSchema,
  resolvers: AppResolvers,
  debug: !setting.production,
  playground: !setting.production,
  context: ({ req }) => {
    const rsPool = new DatabasePool(pool_rs);

    return {
      rsPool: rsPool
    }
  }
});

server.listen(setting.port);