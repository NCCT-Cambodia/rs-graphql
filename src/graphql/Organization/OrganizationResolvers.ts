import { Graph } from "../../generated/graph";
import { ContextType } from "../../types/ContextType";

export const OrganizationListResolver = async (
  _, 
  { pagination }: { pagination: Graph.PaginationInput },
  ctx: ContextType
) => {
  const resultCount = (await ctx.rsPool.first(`
    SELECT 
      COUNT(*) AS total
    FROM organization
    WHERE deleted = 'F'`)).total;

  const result = await ctx.rsPool.select(`
    SELECT 
      organization_id, organization_name
    FROM organization
    WHERE deleted = 'F'
    LIMIT ? ,?`, [ (pagination.page -1 ) * pagination.size, pagination.size ]);
  
  return {
    data: result.map(org => reduce(org)),
    page: {
      total: resultCount,
      size: pagination.size,
      current: pagination.page
    }
  }
}

function reduce(org) {
  const orgName = JSON.parse(org.organization_name);

  return {
    id: org.organization_id,
    name: {
      en: orgName.en,
      kh: orgName.kh
    }
  }
}