import { User } from "./SessionTypes";

export const enum GameResult {
  Ongoing,
  WhiteWins,
  BlackWins,
  Draw,
}

export type Game = {
  id: number;
  whitePlayer: User;
  blackPlayer: User;
  pgn: string;
  result: GameResult;
}

