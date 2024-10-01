import { useState, useEffect, useCallback } from "react";

export const useTimer = (initialTime: number, onTimeout: () => void) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  const resetTimer = useCallback(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  return { timeLeft, resetTimer };
};
