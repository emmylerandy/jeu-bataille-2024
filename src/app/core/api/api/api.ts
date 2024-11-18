export * from './default.service';
import { DefaultService } from './default.service';
export * from './games.service';
import { GamesService } from './games.service';
export * from './players.service';
import { PlayersService } from './players.service';
export const APIS = [DefaultService, GamesService, PlayersService];
