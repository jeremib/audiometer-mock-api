import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface ProfileSearchResult {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  department: string;
  lastTestDate?: string;
  tenantId: string;
  groupId: string;
}

export interface ProfileSearchResponse {
  profiles: ProfileSearchResult[];
}

export function useProfileSearch(tenantId: string, searchQuery: string, enabled = true) {
  return useQuery<ProfileSearchResponse>({
    queryKey: ["api", tenantId, "profiles", "search", { q: searchQuery }],
    queryFn: async () => {
      if (!searchQuery.trim()) {
        return { profiles: [] };
      }
      
      const response = await apiRequest(
        "GET",
        `/api/${tenantId}/profiles/search?q=${encodeURIComponent(searchQuery.trim())}`
      );
      
      return response.json();
    },
    enabled: enabled && !!tenantId && !!searchQuery.trim(),
    staleTime: 30000, // Cache for 30 seconds
  });
}