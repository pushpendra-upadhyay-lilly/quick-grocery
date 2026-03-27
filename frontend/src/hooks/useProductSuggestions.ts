import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';

interface SuggestionProduct {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
}

export function useProductSuggestions(query: string, limit = 8) {
  return useQuery({
    queryKey: ['products', 'suggestions', query],
    queryFn: async () => {
      if (!query || query.length < 2) {
        return [];
      }
      const response = await apiClient.get<SuggestionProduct[]>('/products', {
        params: {
          search: query,
          limit,
          inStock: true,
        },
      });
      // Return just the data array, limit to the requested amount
      return (response.data.data || []).slice(0, limit);
    },
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
