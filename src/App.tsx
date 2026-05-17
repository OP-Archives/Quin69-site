import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, type LoaderFunctionArgs } from 'react-router-dom';
import Navbar from './navbar/navbar';
import { getVod } from './utils/archive-client';
import ErrorBoundary from './utils/ErrorBoundary';
import Loading from './utils/Loading';
import { queryClient } from './utils/queryClient';
import NotFound from './utils/NotFound';
import GamesPage, { gamesLoader } from './games/Games';
import GamesLibrary, { gamesLibraryLoader } from './games/GamesLibrary';

const VodPlayer = lazy(() =>
  Promise.all([import('@op-archives/vod-components'), import('@op-archives/vod-components/index.css')]).then((m) => ({
    default: m[0].Games,
  }))
);

const channel = import.meta.env.VITE_CHANNEL;
const logo = '/logo.jpg';
const origin = import.meta.env.VITE_DOMAIN || window.location.origin;
const archiveApiBase = import.meta.env.VITE_ARCHIVE_API_BASE;
const twitchId = Number(import.meta.env.VITE_TWITCH_ID);

const MainLayout = () => (
  <>
    <Navbar channel={channel} />
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  </>
);

const videoLoader = async ({ params, request }: LoaderFunctionArgs) => {
  if (params.vodId) {
    queryClient.prefetchQuery({
      queryKey: ['vod', params.vodId],
      queryFn: () => getVod(params.vodId as string, { signal: request.signal }),
      staleTime: 5 * 60 * 1000,
    });
  }
  return null;
};

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <NotFound channel={channel} />,
    HydrateFallback: () => <Loading />,
    children: [
      { path: '/', loader: gamesLoader, element: <GamesPage /> },
      { path: '/games', loader: gamesLoader, element: <GamesPage /> },
      { path: '/games/library', loader: gamesLibraryLoader, element: <GamesLibrary /> },
    ],
  },
  {
    path: '/games/:vodId',
    loader: videoLoader,
    element: (
      <Suspense fallback={<Loading />}>
        <VodPlayer
          channel={channel}
          logo={logo}
          origin={origin}
          archiveApiBase={archiveApiBase}
          twitchId={twitchId}
        />
      </Suspense>
    ),
  },
]);

export default function App() {
  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col bg-dark">
      <ErrorBoundary channel={channel}>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </div>
  );
}
