import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Board } from "../components/Board";
import { Menu } from "../components/Menu";
import { GameEnded } from "../components/GameEnded";
import { levels } from "../levels";

export const MainScreen: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);

  const [isGameEnded, setIsGameEnded] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);

  const handleStartGame = (level: number) => {
    setCurrentLevel(level);
    setIsGameEnded(false);
    setGameWon(false);
    setIsTimeout(false);
  };

  const handleBackToMenu = () => {
    setCurrentLevel(null);
  };

  if (currentLevel === null) {
    return <Menu onStartGame={handleStartGame} />;
  }

  const handleGameOver = (won: boolean, timeout: boolean) => {
    setIsGameEnded(true);
    setGameWon(won);
    setIsTimeout(timeout);
  };

  if (isGameEnded) {
    return <GameEnded won={gameWon} isTimeout={isTimeout} onBackToMenu={handleBackToMenu} />;
  }

  return (
    <View style={styles.container}>
      <Board
        board={levels[currentLevel].board}
        enemySpeed={levels[currentLevel].settings.enemySpeed}
        timeLimit={levels[currentLevel].settings.timeLimit}
        onGameOver={handleGameOver}
        onExit={handleBackToMenu} // Add this line
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
