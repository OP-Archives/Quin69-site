import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import CustomLink from '../utils/CustomLink';
import GameImage from './GameImage';
import CustomWidthTooltip from '../utils/CustomToolTip';
import { toHHMMSS } from '../utils/helpers';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat.js';
dayjs.extend(localizedFormat);

export default function Game(props) {
  const { game } = props;
  const gameRoute = `/games/${game.vod_id}?game_id=${game.id}`;

  return (
    <Grid sx={{ maxWidth: '20rem', flexBasis: '20rem' }}>
      <Box
        sx={{
          overflow: 'hidden',
          height: 0,
          paddingTop: '56.25%',
          position: 'relative',
          '&:hover': {
            boxShadow: '0 0 8px #fff',
          },
        }}
      >
        <Link href={gameRoute}>
          <img className="thumbnail" alt="" src={game.thumbnail_url} />
        </Link>
        <Box sx={{ pointerEvents: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <Box sx={{ position: 'absolute', bottom: 0, left: 0 }}>
            <Typography variant="caption" sx={{ p: 0.3, backgroundColor: 'rgba(0,0,0,.6)' }}>
              {dayjs(game.created_at).format('LL')}
            </Typography>
          </Box>
          <Box sx={{ position: 'absolute', bottom: 0, right: 0 }}>
            <Typography variant="caption" sx={{ p: 0.3, backgroundColor: 'rgba(0,0,0,.6)' }}>
              {toHHMMSS(game.duration)}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 1, mb: 1, display: 'flex' }}>
        <GameImage game={game} />
        <Box sx={{ minWidth: 0, width: '100%' }}>
          <Box sx={{ p: 0.5 }}>
            <CustomWidthTooltip title={game.title} placement="top">
              <span>
                <CustomLink
                  href={gameRoute}
                  sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                >
                  <Typography variant="caption" color="primary" sx={{ fontWeight: '550' }}>
                    {game.title}
                  </Typography>
                </CustomLink>
              </span>
            </CustomWidthTooltip>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}
