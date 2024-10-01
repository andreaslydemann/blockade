export type Point = {
  x: number;
  y: number;
};

export interface BoardProps {
  board: string[][];
  enemySpeed: number;
  timeLimit: number;
  onGameOver: (won: boolean, isTimeout: boolean) => void;
  onExit: () => void;
}
