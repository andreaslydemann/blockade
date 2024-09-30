import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  PanResponder,
  View,
  Pressable,
  PanResponderGestureState,
} from "react-native";
import { Player } from "./Player";
import { Wall } from "./Wall";
import { Box } from "./Box";
import { Target } from "./Target";
import { Vide } from "./Vide";

interface BoardProps {
  board: string[][];
  onGameOver: () => void;
}

export const Board: React.FC<BoardProps> = ({
  board: initialBoard,
  onGameOver,
}) => {
  const [swipeDirection, setSwipeDirection] = useState<string>("");
  const [board, setBoard] = useState<string[][]>(initialBoard);
  const [swipeHandled, setSwipeHandled] = useState<boolean>(false);
  const [nextX, setNextX] = useState<number>(4);
  const [nextY, setNextY] = useState<number>(4);
  const [isCroix, setIsCroix] = useState<number>(0);

  const handleSwipe = (): void => {
    if (!swipeHandled) {
      setSwipeHandled(true);
    }
  };

  const checkWin = (newBoard: string[][]): void => {
    const thereIsAnX = newBoard.some((subArray) => subArray.includes("X"));
    if (!thereIsAnX) {
      console.log("Victoire");
      onGameOver();
    }
  };

  const CheckCroix = (
    newBoard: string[][],
    PositionX: number,
    PositionY: number,
    currentPlayerPosition: { x: number; y: number }
  ): void => {
    if (isCroix === 0) {
      newBoard[currentPlayerPosition.x][currentPlayerPosition.y] = ".";
      newBoard[PositionX][PositionY] = "P";
      setIsCroix(1);
    } else {
      newBoard[currentPlayerPosition.x][currentPlayerPosition.y] = "X";
      newBoard[nextX][nextY] = "P";
      setIsCroix(0);
    }
  };

  const CheckCroixCaseVide = (
    newBoard: string[][],
    PositionX: number,
    PositionY: number,
    currentPlayerPosition: { x: number; y: number }
  ): void => {
    if (isCroix === 0) {
      newBoard[currentPlayerPosition.x][currentPlayerPosition.y] = ".";
      newBoard[PositionX][PositionY] = "P";
    } else {
      newBoard[currentPlayerPosition.x][currentPlayerPosition.y] = "X";
      newBoard[nextX][nextY] = "P";
      setIsCroix(0);
    }
  };

  useEffect(() => {
    setPlayerPosition(nextX, nextY);
  }, [nextX, nextY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
        const { dx, dy } = gestureState;
        if (Math.abs(dx) > Math.abs(dy)) {
          setSwipeDirection(dx > 0 ? "right" : "left");
          handleSwipe();
          if (dx > 0) setNextX((prevX) => prevX + 1);
          else setNextX((prevX) => prevX - 1);
        } else {
          if (dy > 0) setNextY((prevY) => prevY + 1);
          else setNextY((prevY) => prevY - 1);
          setSwipeDirection(dy > 0 ? "down" : "up");
        }
      },
    })
  ).current;

  const setPlayerPosition = (nextX: number, nextY: number): void => {
    let _currentPlayerPosition: { x: number; y: number } | null = null;
    const newBoard = board.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        if (cell === "P") {
          _currentPlayerPosition = { x: rowIndex, y: cellIndex } as {
            x: number;
            y: number;
          } | null;
        }
        return cell;
      })
    );

    if (!_currentPlayerPosition) {
      console.error("Player position not found on the board");
      return;
    }

    const currentPlayerPosition = _currentPlayerPosition as {
      x: number;
      y: number;
    };

    if (newBoard[nextX][nextY] === "#") {
      newBoard[currentPlayerPosition.x][currentPlayerPosition.y] = "P";
      setNextX(currentPlayerPosition.x);
      setNextY(currentPlayerPosition.y);
    } else if (newBoard[nextX][nextY] === "B") {
      let boxMoved = false;

      if (
        swipeDirection === "up" &&
        newBoard[nextX][nextY - 1] !== "#" &&
        newBoard[nextX][nextY - 1] !== "B"
      ) {
        newBoard[currentPlayerPosition.x][currentPlayerPosition.y] = ".";
        newBoard[nextX][nextY] = "P";
        newBoard[nextX][nextY - 1] = "B";
        boxMoved = true;
      } else if (
        swipeDirection === "down" &&
        newBoard[nextX][nextY + 1] !== "#" &&
        newBoard[nextX][nextY + 1] !== "B"
      ) {
        newBoard[currentPlayerPosition.x][currentPlayerPosition.y] = ".";
        newBoard[nextX][nextY] = "P";
        newBoard[nextX][nextY + 1] = "B";
        boxMoved = true;
      } else if (
        swipeDirection === "left" &&
        newBoard[nextX - 1][nextY] !== "#" &&
        newBoard[nextX - 1][nextY] !== "B"
      ) {
        newBoard[currentPlayerPosition.x][currentPlayerPosition.y] = ".";
        newBoard[nextX][nextY] = "P";
        newBoard[nextX - 1][nextY] = "B";
        boxMoved = true;
      } else if (
        swipeDirection === "right" &&
        newBoard[nextX + 1][nextY] !== "#" &&
        newBoard[nextX + 1][nextY] !== "B"
      ) {
        newBoard[currentPlayerPosition.x][currentPlayerPosition.y] = ".";
        newBoard[nextX][nextY] = "P";
        newBoard[nextX + 1][nextY] = "B";
        boxMoved = true;
      }
      if (boxMoved) {
        newBoard[currentPlayerPosition.x][currentPlayerPosition.y] = ".";
        newBoard[nextX][nextY] = "P";
      } else {
        setNextX(currentPlayerPosition.x);
        setNextY(currentPlayerPosition.y);
      }

      checkWin(newBoard);
    } else if (newBoard[nextX][nextY] === "X") {
      CheckCroix(newBoard, nextX, nextY, currentPlayerPosition);
    } else {
      CheckCroixCaseVide(newBoard, nextX, nextY, currentPlayerPosition);
    }
    setBoard(newBoard);
  };

  const handleDirectionButton = (direction: string): void => {
    setSwipeDirection(direction);
    switch (direction) {
      case "up":
        setNextY((prevY) => prevY - 1);
        break;
      case "down":
        setNextY((prevY) => prevY + 1);
        break;
      case "left":
        setNextX((prevX) => prevX - 1);
        break;
      case "right":
        setNextX((prevX) => prevX + 1);
        break;
    }
    handleSwipe();
  };

  return (
    <View>
      <View {...panResponder.panHandlers}>
        <View style={styles.container}>
          {board.map((row, rowIndex) => (
            <View key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <View
                  key={cellIndex}
                  style={[styles.cell, cell === "#" && styles.wall]}
                >
                  {cell === "." && (
                    <Image
                      source={require("../../assets/images/background.png")}
                    />
                  )}
                  {cell === "#" && <Wall />}
                  {cell === "P" && <Player />}
                  {cell === "B" && <Box />}
                  {cell === "X" && <Target />}
                  {cell === "@" && <Vide />}
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={() => handleDirectionButton("up")}
        >
          <Text style={styles.buttonText}>↑</Text>
        </Pressable>
        <View style={styles.horizontalButtons}>
          <Pressable
            style={styles.button}
            onPress={() => handleDirectionButton("left")}
          >
            <Text style={styles.buttonText}>←</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => handleDirectionButton("right")}
          >
            <Text style={styles.buttonText}>→</Text>
          </Pressable>
        </View>
        <Pressable
          style={styles.button}
          onPress={() => handleDirectionButton("down")}
        >
          <Text style={styles.buttonText}>↓</Text>
        </Pressable>
      </View>

      <Text style={styles.text}>{board}</Text>
      <Text style={styles.text}>{swipeDirection}</Text>
      <Text style={styles.text}>{nextX}</Text>
      <Text style={styles.text}>{nextY}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  cell: {
    width: 30,
    height: 30,
    textAlign: "center",
    lineHeight: 30,
    fontWeight: "bold",
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
  wall: { borderWidth: 2, borderColor: "red" },
  text: {
    color: "white",
    fontSize: 24,
  },
});
