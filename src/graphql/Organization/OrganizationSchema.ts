import { gql } from "apollo-server";
import { OrganizationListResolver } from "./OrganizationResolvers";

export const OrganizationSchema = gql`
  extend type Query {
    organizationList(pagination: PaginationInput!): OrganizationList
  }

  type OrganizationList {
    data: [Organization]
    page: Pagination
  }

  type Organization {
    id: Int
    name: LanguageFormat
  }
`;

export const OrganizationGraphResolvers = {
  Query: {
    organizationList: OrganizationListResolver
  }
}