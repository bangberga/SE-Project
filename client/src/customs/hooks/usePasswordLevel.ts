import { useCallback, useState } from "react";

type LevelTypes = "STRONG" | "MEDIUM" | "WEAK" | null;

export default function usePasswordLevel(): [
  LevelTypes,
  (level: LevelTypes) => void
] {
  const [level, setLevel] = useState<LevelTypes>(null);

  const handleLevel = useCallback((level: LevelTypes) => {
    setLevel(level);
  }, []);

  return [level, handleLevel];
}
