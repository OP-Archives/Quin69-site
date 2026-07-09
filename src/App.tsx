import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './navbar/navbar';
import ErrorBoundary from './utils/ErrorBoundary';
import NotFound from './utils/NotFound';
import GamesPage from './games/Games';
import GamesLibrary from './games/GamesLibrary';
import Frontpage from './Frontpage';
import '@op-archives/vod-components/index.css';
import { Games } from '@op-archives/vod-components';

const channel = import.meta.env.VITE_CHANNEL;
const logo = '/logo.jpg';
const origin = import.meta.env.VITE_DOMAIN || window.location.origin;
const archiveApiBase = import.meta.env.VITE_ARCHIVE_API_BASE;
const twitchId = Number(import.meta.env.VITE_TWITCH_ID);

function AppLayout() {
  return (
    <>
      <Navbar channel={channel} />
      <main className="relative mx-auto flex min-h-0 w-full flex-1 flex-col max-w-full">
        <Routes>
          <Route path="/" element={<Frontpage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/library" element={<GamesLibrary />} />
          <Route
            path="/games/:vodId"
            element={
              <Games channel={channel} logo={logo} origin={origin} archiveApiBase={archiveApiBase} twitchId={twitchId} />
            }
          />
          <Route path="*" element={<NotFound channel={channel} />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col bg-dark">
      <ErrorBoundary channel={channel}>
        <BrowserRouter>
          <div className="flex min-h-0 flex-1 flex-col">
            <AppLayout />
          </div>
        </BrowserRouter>
      </ErrorBoundary>
    </div>
  );
}
