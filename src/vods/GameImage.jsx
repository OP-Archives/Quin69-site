import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { getImage } from '../utils/helpers';

export default function Chapters(props) {
  const { game } = props;

  return (
    <Box sx={{ pr: 1 }}>
      <Tooltip title={game.game_name}>
        <img alt="" src={getImage(game.chapter_image)} style={{ width: '40px', height: '53px' }} />
      </Tooltip>
    </Box>
  );
}
