import { getImage } from '../utils/helpers';

interface GameImageProps {
  game: {
    chapter_image?: string;
    game_name?: string;
  };
}

export default function GameImage({ game }: GameImageProps) {
  return (
    <div className="pr-1">
      <img alt="" src={getImage(game.chapter_image)} style={{ width: '40px', height: '53px' }} />
    </div>
  );
}
