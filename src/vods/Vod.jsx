import { Box, Typography, Link, Grid } from '@mui/material';
import CustomLink from '../utils/CustomLink';
import GameImage from './GameImage';
import CustomWidthTooltip from '../utils/CustomToolTip';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat.js';
import { toHHMMSS } from '../utils/helpers';
dayjs.extend(localizedFormat);

export default function Vod(props) {
  const { vod } = props;

  return vod.games.reverse().map((game, _) => {
    const gameLink = `/games/${vod.id}?game_id=${game.id}`;
    let gameDuration = parseInt(game.end_time);
    //Edge case when there are two parts and exceed 12+ hours.
    while (gameDuration > import.meta.env.VITE_DEFAULT_DELAY) {
      gameDuration -= import.meta.env.VITE_DEFAULT_DELAY;
    }
    return (
      <Grid key={game.id} sx={{ maxWidth: '20rem', flexBasis: '20rem' }}>
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
          <Link href={gameLink}>
            <img className="thumbnail" alt="" src={game.thumbnail_url} />
          </Link>
          <Box sx={{ pointerEvents: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Box sx={{ position: 'absolute', bottom: 0, left: 0 }}>
              <Typography variant="caption" sx={{ p: 0.3, backgroundColor: 'rgba(0,0,0,.6)' }}>
                {`${dayjs(vod.createdAt).format('LL')}`}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ pointerEvents: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Box sx={{ position: 'absolute', bottom: 0, right: 0 }}>
              <Typography variant="caption" sx={{ p: 0.3, backgroundColor: 'rgba(0,0,0,.6)' }}>
                {`${toHHMMSS(gameDuration)}`}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ mt: 1, mb: 1, display: 'flex' }}>
          <GameImage game={game} />
          <Box sx={{ minWidth: 0, width: '100%' }}>
            <Box sx={{ p: 0.5 }}>
              <CustomWidthTooltip title={vod.title} placement="top">
                <span>
                  <CustomLink href={gameLink} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
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
  });
}
