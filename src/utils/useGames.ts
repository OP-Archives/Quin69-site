import { useQuery, QueryClient, keepPreviousData } from '@tanstack/react-query';
import { listGames, type GameData } from './archive-client';

interface ListGamesParams {
  limit?: number | string;
  page?: number | string;
  sort?: string;
  order?: string;
  game_name?: string;
  title?: string;
  platform?: string;
  from?: string;
  to?: string;
  game_id?: string;
}

interface GamesResponse {
  data: GameData[];
  meta: { total: number };
}

export function useGames(params: ListGamesParams) {
  return useQuery<GamesResponse>({
    queryKey: ['games', params],
    queryFn: ({ signal }) => listGames({ ...params, signal }),
    enabled: params.limit !== undefined && params.page !== undefined,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export const prefetchNextPageGames = (queryClient: QueryClient, params: ListGamesParams) => {
  queryClient.prefetchQuery({
    queryKey: ['games', params],
    queryFn: ({ signal }) => listGames({ ...params, signal }),
    staleTime: 5 * 60 * 1000,
  });
};
