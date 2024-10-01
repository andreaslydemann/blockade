import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface GameEndedProps {
  won: boolean;
  isTimeout: boolean;
  onBackToMenu: () => void;
}

export const GameEnded: React.FC<GameEndedProps> = ({ won, isTimeout, onBackToMenu }) => {
  let message = won ? "You Won!" : "Game Over";
  if (isTimeout) {
    message = "Time Out!";
  }

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.button} onPress={onBackToMenu}>
        <Text style={styles.buttonText}>Restart</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  message: {
    fontSize: 32,
    color: "white",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
