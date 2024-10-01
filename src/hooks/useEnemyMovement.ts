import { useState, useEffect, useCallback, useRef } from "react";
import { Point } from "../types";

export const useEnemyMovement = (
  initialBoard: string[][],
  setBoard: React.Dispatch<React.SetStateAction<string[][]>>,
  playerPosition: Point,
  enemySpeed: number,
  checkGameOver: (board: string[][]) => void,
  onGameOver: (won: boolean, isTimeout: boolean) => void
) => {
  const [enemies, setEnemies] = useState<Point[]>([]);
  const enemiesRef = useRef<Point[]>([]);
  const boardRef = useRef<string[][]>(initialBoard);

  useEffect(() => {
    const initialEnemies = initialBoard
      .flatMap((row, x) => row.map((cell, y) => (cell === "E" ? { x, y } : null)))
      .filter((enemy): enemy is Point => enemy !== null);
    setEnemies(initialEnemies);
    enemiesRef.current = initialEnemies;
  }, [initialBoard]);

  const findPlayerPosition = (board: string[][]): Point | null => {
    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board[x].length; y++) {
        if (board[x][y] === "P") return { x, y };
      }
    }
    return null;
  };

  const checkAllEnemiesTrapped = (board: string[][], enemies: Point[]): boolean => {
    return enemies.every((enemy) => {
      const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      return directions.every(([dx, dy]) => {
        const newX = enemy.x + dx;
        const newY = enemy.y + dy;
        return (
          newX < 0 ||
          newX >= board.length ||
          newY < 0 ||
          newY >= board[0].length ||
          board[newX][newY] === "#" ||
          board[newX][newY] === "B" ||
          board[newX][newY] === "E"
        );
      });
    });
  };

  const findBestMove = (board: string[][], enemy: Point, player: Point): Point | null => {
    const queue: { point: Point; path: Point[] }[] = [{ point: enemy, path: [] }];
    const visited = new Set<string>();
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    let bestMove: Point | null = null;
    let bestDistance = Infinity;

    while (queue.length > 0) {
      const { point, path } = queue.shift()!;
      const key = `${point.x},${point.y}`;

      if (visited.has(key)) continue;
      visited.add(key);

      const distanceToPlayer = Math.abs(point.x - player.x) + Math.abs(point.y - player.y);

      if (distanceToPlayer < bestDistance) {
        bestDistance = distanceToPlayer;
        bestMove = path.length > 0 ? path[0] : null;
      }

      if (point.x === player.x && point.y === player.y) {
        break;
      }

      for (const [dx, dy] of directions) {
        const newX = point.x + dx;
        const newY = point.y + dy;

        if (
          newX >= 0 &&
          newX < board.length &&
          newY >= 0 &&
          newY < board[0].length &&
          (board[newX][newY] === "." || board[newX][newY] === "P")
        ) {
          const newPath = path.length === 0 ? [{ x: newX, y: newY }] : [...path];
          queue.push({ point: { x: newX, y: newY }, path: newPath });
        }
      }
    }

    if (bestMove && bestMove.x === enemy.x && bestMove.y === enemy.y) {
      return null;
    }

    return bestMove;
  };

  const moveEnemies = useCallback(() => {
    setBoard((currentBoard) => {
      boardRef.current = currentBoard;
      const newBoard = currentBoard.map((row) => [...row]);
      const currentEnemies = [...enemiesRef.current];
      const playerPosition = findPlayerPosition(newBoard);

      if (!playerPosition) {
        return newBoard;
      }

      let anyEnemyMoved = false;
      const newEnemies = currentEnemies.map((enemy) => {
        const bestMove = findBestMove(newBoard, enemy, playerPosition);

        if (bestMove) {
          newBoard[enemy.x][enemy.y] = ".";
          newBoard[bestMove.x][bestMove.y] = "E";
          anyEnemyMoved = true;
          return bestMove;
        }

        return enemy;
      });

      if (checkAllEnemiesTrapped(newBoard, newEnemies)) {
        onGameOver(true, false);
        return newBoard;
      }

      if (newEnemies.some((e) => e.x === playerPosition.x && e.y === playerPosition.y)) {
        onGameOver(false, false);
      }

      setEnemies(newEnemies);
      enemiesRef.current = newEnemies;

      return newBoard;
    });
  }, [setBoard, onGameOver]);

  useEffect(() => {
    const interval = setInterval(moveEnemies, 1000 / enemySpeed);
    return () => clearInterval(interval);
  }, [moveEnemies, enemySpeed]);

  return { enemies, moveEnemies };
};
