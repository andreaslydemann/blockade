import React, { useEffect, useState, useCallback } from "react";
import { Image, StyleSheet, Text, View, Pressable, Dimensions, Button } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Player, Wall, Box, Enemy } from "./GameElements";
import { useGameLogic } from "../hooks/useGameLogic";
import { useEnemyMovement } from "../hooks/useEnemyMovement";
import { useTimer } from "../hooks/useTimer";
import { Point, BoardProps } from "../types";

export const Board: React.FC<BoardProps> = ({
  board: initialBoard,
  enemySpeed,
  timeLimit,
  onGameOver,
  onExit,
}) => {
  const [board, setBoard] = useState<string[][]>(initialBoard);
  const [playerPosition, setPlayerPosition] = useState<Point>(
    findInitialPlayerPosition(initialBoard)
  );
  const [cellSize, setCellSize] = useState<number>(0);
  const [boardDimensions, setBoardDimensions] = useState({ width: 0, height: 0 });

  const insets = useSafeAreaInsets();

  const handleTimeout = useCallback(() => {
    onGameOver(false, true);
  }, [onGameOver]);

  const { timeLeft, resetTimer } = useTimer(timeLimit, handleTimeout);

  const { movePlayer, checkGameOver } = useGameLogic(
    board,
    setBoard,
    playerPosition,
    setPlayerPosition,
    onGameOver
  );

  const { enemies, moveEnemies } = useEnemyMovement(
    initialBoard,
    setBoard,
    playerPosition,
    enemySpeed,
    checkGameOver,
    onGameOver
  );

  useEffect(() => {
    calculateBoardDimensions();
  }, [initialBoard, insets]);

  const calculateBoardDimensions = () => {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const boardRows = initialBoard.length;
    const boardCols = initialBoard[0].length;

    const availableWidth = screenWidth - insets.left - insets.right - 40;
    const availableHeight = screenHeight - insets.top - insets.bottom - 200;

    const cellSizeFromWidth = availableWidth / boardCols;
    const cellSizeFromHeight = availableHeight / boardRows;
    const newCellSize = Math.floor(Math.min(cellSizeFromWidth, cellSizeFromHeight));

    setCellSize(newCellSize);
    setBoardDimensions({
      width: newCellSize * boardCols,
      height: newCellSize * boardRows,
    });
  };

  const handleDirectionButton = (direction: string) => {
    const directionMap: { [key: string]: Point } = {
      left: { x: 0, y: -1 },
      right: { x: 0, y: 1 },
      up: { x: -1, y: 0 },
      down: { x: 1, y: 0 },
    };
    const newPosition = {
      x: playerPosition.x + directionMap[direction].x,
      y: playerPosition.y + directionMap[direction].y,
    };
    movePlayer(newPosition);
  };

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.topBar, { top: insets.top }]}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>Time left: {timeLeft}s</Text>
        </View>
        <Button title="Exit" onPress={onExit} />
      </View>

      <View style={styles.boardContainer}>
        <View style={[styles.board, boardDimensions]}>
          {board.map((row, rowIndex) => (
            <View key={rowIndex} style={{ flexDirection: "row" }}>
              {row.map((cell, cellIndex) => (
                <View key={cellIndex} style={[styles.cell, { width: cellSize, height: cellSize }]}>
                  {cell === "." && (
                    <Image
                      source={require("../../assets/images/background.png")}
                      style={{ width: cellSize, height: cellSize }}
                    />
                  )}
                  {cell === "#" && <Wall size={cellSize} />}
                  {cell === "P" && <Player size={cellSize} />}
                  {cell === "B" && <Box size={cellSize} />}
                  {cell === "E" && <Enemy size={cellSize} />}
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => handleDirectionButton("up")}>
          <Text style={styles.buttonText}>↑</Text>
        </Pressable>
        <View style={styles.horizontalButtons}>
          <Pressable style={styles.button} onPress={() => handleDirectionButton("left")}>
            <Text style={styles.buttonText}>←</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => handleDirectionButton("right")}>
            <Text style={styles.buttonText}>→</Text>
          </Pressable>
        </View>
        <Pressable style={styles.button} onPress={() => handleDirectionButton("down")}>
          <Text style={styles.buttonText}>↓</Text>
        </Pressable>
      </View>
    </View>
  );
};

function findInitialPlayerPosition(board: string[][]): Point {
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      if (board[x][y] === "P") return { x, y };
    }
  }
  return { x: 0, y: 0 };
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: "center",
  },
  boardContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  board: {
    flexDirection: "column",
  },
  cell: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  horizontalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 60,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
  },
  text: {
    color: "white",
    fontSize: 24,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  timerContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 5,
  },
  timerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
