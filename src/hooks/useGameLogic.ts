import { useState, useCallback } from "react";
import { Point } from "../types";

export const useGameLogic = (
  board: string[][],
  setBoard: React.Dispatch<React.SetStateAction<string[][]>>,
  playerPosition: Point,
  setPlayerPosition: React.Dispatch<React.SetStateAction<Point>>,
  onGameOver: (won: boolean, isTimeout: boolean) => void
) => {
  const movePlayer = useCallback(
    (newPosition: Point) => {
      setBoard((currentBoard) => {
        const newBoard = currentBoard.map((row) => [...row]);
        const { x: currentX, y: currentY } = playerPosition;
        const { x: nextX, y: nextY } = newPosition;

        if (newBoard[nextX][nextY] === "#") return currentBoard;

        if (newBoard[nextX][nextY] === "B") {
          let boxMoved = false;
          const dx = nextX - currentX;
          const dy = nextY - currentY;

          let boxCount = 0;
          let newBoxX = nextX;
          let newBoxY = nextY;

          // Count how many boxes are in a row
          while (newBoard[newBoxX][newBoxY] === "B") {
            boxCount++;
            newBoxX += dx;
            newBoxY += dy;
          }

          // Check if the space after the last box is free
          if (
            newBoard[newBoxX][newBoxY] !== "#" &&
            newBoard[newBoxX][newBoxY] !== "B" &&
            newBoard[newBoxX][newBoxY] !== "E"
          ) {
            // Move all boxes
            for (let i = 0; i < boxCount; i++) {
              newBoard[newBoxX - dx * i][newBoxY - dy * i] = "B";
            }
            newBoard[currentX][currentY] = ".";
            newBoard[nextX][nextY] = "P";
            boxMoved = true;
          }

          if (boxMoved) {
            setPlayerPosition(newPosition);
          } else {
            return currentBoard;
          }
        } else if (newBoard[nextX][nextY] === "E") {
          onGameOver(false, false);
          return currentBoard;
        } else {
          newBoard[currentX][currentY] = ".";
          newBoard[nextX][nextY] = "P";
          setPlayerPosition(newPosition);
        }

        return newBoard;
      });
    },
    [playerPosition, setBoard, setPlayerPosition, onGameOver]
  );

  const checkGameOver = useCallback(
    (newBoard: string[][]) => {
      const isWin = newBoard.every((row) => row.every((cell) => cell !== "T" && cell !== "B"));
      if (isWin) {
        onGameOver(true, false);
      }
    },
    [onGameOver]
  );

  return { movePlayer, checkGameOver };
};
