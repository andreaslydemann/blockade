import React from "react";
import { Image } from "react-native";

interface GameElementProps {
  size: number;
}

export const Player: React.FC<GameElementProps> = ({ size }) => (
  <Image source={require("../../assets/images/player.png")} style={{ width: size, height: size }} />
);

export const Wall: React.FC<GameElementProps> = ({ size }) => (
  <Image source={require("../../assets/images/wall.png")} style={{ width: size, height: size }} />
);

export const Box: React.FC<GameElementProps> = ({ size }) => (
  <Image source={require("../../assets/images/box.png")} style={{ width: size, height: size }} />
);

export const Enemy: React.FC<GameElementProps> = ({ size }) => (
  <Image source={require("../../assets/images/enemy.png")} style={{ width: size, height: size }} />
);

export const Background: React.FC<GameElementProps> = ({ size }) => (
  <Image
    source={require("../../assets/images/background.png")}
    style={{ width: size, height: size }}
  />
);
