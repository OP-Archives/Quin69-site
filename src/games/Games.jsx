import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import SimpleBar from 'simplebar-react';
import Footer from '../utils/Footer';
import Loading from '../utils/Loading';
import Game from './Game';
import { useLocation, useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useDebouncedSetter } from '../utils/debounceHelper';
import { listGames } from './client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaginationControls from './PaginationControls';

const FILTERS = ['Default', 'Date', 'Game'];
const START_DATE = import.meta.env.VITE_START_DATE;

export default function GamesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const isMobile = useMediaQuery('(max-width: 900px)');
  const [games, setGames] = useState(null);
  const [totalGames, setTotalGames] = useState(null);
  const [filter, setFilter] = useState(FILTERS[0]);
  const [filterStartDate, setFilterStartDate] = useState(dayjs(START_DATE));
  const [filterEndDate, setFilterEndDate] = useState(dayjs());
  const [filterGame, setFilterGame] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const page = parseInt(query.get('page') || '1', 10);
  const limit = isMobile ? 10 : 20;
  const gameId = query.get('game_id');

  useEffect(() => {
    setError(null);
    setLoading(true);
    setGames(null);

    const fetchGames = async () => {
      try {
        const params = { limit, page, sort: 'created_at', order: 'desc' };

        if (gameId) {
          params.game_id = gameId;
        } else {
          switch (filter) {
            case 'Date':
              if (filterStartDate > filterEndDate) {
                setError('End date must be after start date');
                setLoading(false);
                return;
              }
              params.from = filterStartDate.toISOString();
              params.to = filterEndDate.toISOString();
              break;
            case 'Game':
              if (filterGame.length === 0) {
                setLoading(false);
                return;
              }
              params.game_name = filterGame;
              break;
          }
        }

        const response = await listGames(params);
        setGames(response.data);
        setTotalGames(response.meta.total);
      } catch {
        setError('Failed to load Games. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
    return;
  }, [limit, page, filter, filterStartDate, filterEndDate, filterGame, gameId]);

  const changeFilter = (evt) => {
    setFilter(evt.target.value);
    const params = new URLSearchParams({ page: '1' });
    if (gameId) params.set('game_id', gameId);
    navigate(`${location.pathname}?${params}`);
  };

  const handleGameChange = useDebouncedSetter(setFilterGame, 500);

  const totalPages = Math.ceil(totalGames / limit);

  return (
    <SimpleBar style={{ minHeight: 0, height: '100%' }}>
      <Box sx={{ padding: 2 }}>
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
                  {`${totalGames} Games`}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                pl: !isMobile ? 12 : 1,
                pr: !isMobile ? 12 : 1,
                pt: 1,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {gameId && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ArrowBackIcon fontSize="small" />}
                  onClick={() => navigate('/games/library')}
                  sx={{ mr: 2 }}
                >
                  Back
                </Button>
              )}
              <FormControl sx={{ display: 'flex', minWidth: 120 }} disabled={!!gameId}>
                <InputLabel id="select-label">Filter</InputLabel>
                <Select labelId="select-label" label="Filter" value={filter} onChange={changeFilter}>
                  {FILTERS.map((data, i) => {
                    return (
                      <MenuItem key={i} value={data}>
                        {data}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              {filter === 'Date' && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ ml: 1 }}>
                    <DatePicker
                      minDate={dayjs(START_DATE)}
                      maxDate={dayjs()}
                      sx={{ mr: 1 }}
                      label="Start Date"
                      defaultValue={filterStartDate}
                      onAccept={(newDate) => setFilterStartDate(newDate)}
                      views={['year', 'month', 'day']}
                    />
                    <DatePicker
                      minDate={dayjs(START_DATE)}
                      maxDate={dayjs()}
                      label="End Date"
                      defaultValue={filterEndDate}
                      onAccept={(newDate) => setFilterEndDate(newDate)}
                      views={['year', 'month', 'day']}
                    />
                  </Box>
                </LocalizationProvider>
              )}
              {filter === 'Game' && (
                <Box sx={{ ml: 1 }}>
                  <TextField
                    fullWidth
                    label="Search by Game"
                    type="text"
                    onChange={(e) => handleGameChange(e.target.value)}
                    defaultValue={filterGame}
                  />
                </Box>
              )}
            </Box>
            {loading ? <Loading /> : <></>}
            {games && games.length > 0 && (
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                sx={{ mt: 2, justifyContent: 'center' }}
              >
                {games.map((game) => (
                  <Game key={game.id} game={game} isMobile={isMobile} />
                ))}
              </Grid>
            )}
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
