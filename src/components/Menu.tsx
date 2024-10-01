import { levels } from "@levels";
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface MenuProps {
  onStartGame: (level: number) => void;
}

export const Menu: React.FC<MenuProps> = ({ onStartGame }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Box 'Em Goose!</Text>
      {levels.map((_, index) => (
        <Pressable key={index} style={styles.button} onPress={() => onStartGame(index)}>
          <Text style={styles.buttonText}>Level {index + 1}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
