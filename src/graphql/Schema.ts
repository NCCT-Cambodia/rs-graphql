import { gql } from "apollo-server";
import { OrganizationSchema, OrganizationGraphResolvers } from "./Organization/OrganizationSchema";

const BASE_SCHEMA = gql`
  type Query {
    _empty: String
    me: User
  }

  type Mutation {
    _empty: String
  }

  type User {
    id: String
    username: String
    name: LanguageFormat
    role: String
    profilePicture: String
    superPermission: Boolean
    permissions: [String]
  }

  type LanguageFormat {
    en: String
    kh: String
  }

  type Pagination {
    total: Int!
    current: Int!
    size: Int!
  }

  input PaginationInput {
    page: Int!
    size: Int!
  }
`;

export const AppSchema = [
  BASE_SCHEMA,
  OrganizationSchema
]

export const AppResolvers = [
  OrganizationGraphResolvers
]