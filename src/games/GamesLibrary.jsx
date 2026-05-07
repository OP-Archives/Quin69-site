import { useEffect, useState, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ClearIcon from '@mui/icons-material/Clear';
import SimpleBar from 'simplebar-react';
import Footer from '../utils/Footer';
import Loading from '../utils/Loading';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getGamesLibrary } from './client';
import { getImage } from '../utils/helpers';
import CustomWidthTooltip from '../utils/CustomToolTip';
import PaginationControls from './PaginationControls';

const FILTERS = ['Recently Played', 'Most Played', 'Game Name'];

export default function GamesLibrary() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const isMobile = useMediaQuery('(max-width: 900px)');
  const [games, setGames] = useState(null);
  const [totalGames, setTotalGames] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState(FILTERS[0]);
  const apiSort = filter === 'Recently Played' ? 'recent' : filter === 'Game Name' ? 'game_name' : 'count';
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const page = parseInt(query.get('page') || '1', 10);
  const limit = isMobile ? 10 : 20;
  const gameId = query.get('game_id');
  const debounceTimer = useRef(null);
  const nativeInputRef = useRef(null);

  const fetchGames = async (term) => {
    setError(null);
    setLoading(true);
    setGames(null);
    try {
      const params = { page, limit };
      if (gameId) {
        params.game_id = gameId;
      }
      if (term.length > 0) {
        params.game_name = term;
      }
      params.sort = apiSort;
      params.order = filter === 'Game Name' ? 'asc' : 'desc';
      const response = await getGamesLibrary(params);
      setGames(response.data);
      setTotalGames(response.meta.total);
    } catch {
      setError('Failed to load Library. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames(searchTerm);
  }, [page, limit, searchTerm, filter]);

  const handleSearch = useCallback((value) => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setSearchTerm(value);
    }, 400);
  }, []);

  const changeFilter = (evt) => {
    setFilter(evt.target.value);
    const params = new URLSearchParams({ page: '1' });
    const gameId = query.get('game_id');
    if (gameId) params.set('game_id', gameId);
    navigate(`${location.pathname}?${params}`);
  };

  const handleClearSearch = () => {
    clearTimeout(debounceTimer.current);
    setSearchTerm('');
    if (nativeInputRef.current) {
      nativeInputRef.current.value = '';
    }
  };

  const totalPages = Math.ceil(totalGames / limit);

  return (
    <SimpleBar style={{ minHeight: 0, height: '100%' }}>
      <Box sx={{ px: 2, py: 1 }}>
        {error ? (
          <Typography variant="body1" color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        ) : (
          <>
            <Box
              sx={{ display: 'flex', justifyContent: 'center', mt: 2, flexDirection: 'column', alignItems: 'center' }}
            >
              {totalGames !== null && (
                <Typography variant="h4" color="primary" sx={{ textTransform: 'uppercase', fontWeight: '550' }}>
                  {`${totalGames} Total Games`}
                </Typography>
              )}
            </Box>
            <Box sx={{ maxWidth: 1100, margin: '0 auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, pb: 2 }}>
                <Box sx={{ width: 200 }}>
                  <TextField
                    label="Search by Game Name"
                    type="text"
                    onChange={(e) => handleSearch(e.target.value)}
                    slotProps={{
                      input: {
                        inputRef: nativeInputRef,
                        endAdornment: searchTerm && (
                          <IconButton onClick={handleClearSearch}>
                            <ClearIcon />
                          </IconButton>
                        ),
                      },
                    }}
                  />
                </Box>
                <FormControl sx={{ mt: isMobile ? 1 : 0, minWidth: 120 }}>
                  <InputLabel id="sort-label">Sort</InputLabel>
                  <Select labelId="sort-label" label="Sort" value={filter} onChange={changeFilter}>
                    {FILTERS.map((data) => (
                      <MenuItem key={data} value={data}>
                        {data}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {loading ? <Loading /> : <></>}
              {games && games.length > 0 && (
                <Box
                  sx={{
                    mt: 0.5,
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
                    gap: 1.5,
                  }}
                >
                  {games.map((game) => (
                    <Box
                      key={game.game_id}
                      component={Link}
                      to={`/games?game_id=${game.game_id}`}
                      sx={{
                        borderRadius: 1,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        '&:hover': { boxShadow: '0 0 8px rgba(255,255,255,.6)' },
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          paddingTop: '132.5%',
                          position: 'relative',
                          bgcolor: 'action.disabledBackground',
                        }}
                      >
                        {game.chapter_image ? (
                          <img
                            src={getImage(game.chapter_image, 400, 530)}
                            alt=""
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <Typography
                            variant="caption"
                            color="primary"
                            sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                          >
                            No image
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ px: 1, py: 0.5, textAlign: 'center' }}>
                        <CustomWidthTooltip title={game.game_name} placement="top">
                          <span>
                            <Typography
                              variant="caption"
                              color="primary"
                              noWrap
                              sx={{ fontWeight: '550', display: 'block' }}
                            >
                              {game.game_name}
                            </Typography>
                          </span>
                        </CustomWidthTooltip>
                        <Typography variant="caption" color="primary">
                          {game.count || 0} EPs
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            <PaginationControls
              page={page}
              totalPages={totalPages}
              preserveParams={gameId ? { game_id: gameId } : undefined}
            />
          </>
        )}
      </Box>
      <Footer />
    </SimpleBar>
  );
}
