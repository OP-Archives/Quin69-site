import { useQuery, QueryClient, keepPreviousData } from '@tanstack/react-query';
import { getGamesLibrary, type LibraryGameItem } from './archive-client';

interface LibraryParams {
  game_id?: string;
  game_name?: string;
  chapter_name?: string;
  sort?: string;
  order?: string;
  page?: number | string;
  limit?: number | string;
}

interface GamesLibraryResponse {
  data: LibraryGameItem[];
  meta: { total: number };
}

export function useGamesLibrary(params: LibraryParams) {
  return useQuery<GamesLibraryResponse>({
    queryKey: ['games-library', params],
    queryFn: ({ signal }) => getGamesLibrary({ ...params, signal }),
    enabled: params.limit !== undefined && params.page !== undefined,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export const prefetchNextPageGamesLibrary = (queryClient: QueryClient, params: LibraryParams) => {
  queryClient.prefetchQuery({
    queryKey: ['games-library', params],
    queryFn: ({ signal }) => getGamesLibrary({ ...params, signal }),
    staleTime: 5 * 60 * 1000,
  });
};
