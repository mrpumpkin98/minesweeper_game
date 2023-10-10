import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  Text,
} from "react-native";
import DismissKeyboardView from "../components/DismissKeyboardView";

interface Cell {
  isMine: boolean;
  isOpen: boolean;
  count: number;
}

export default function Expert() {
  const numRows = 14;
  const numCols = 32;
  const [inputText, setInputText] = useState<string>("");
  const [mines, setMines] = useState<[number, number][]>([]);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [editable, setEditable] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSuccess, setGameSuccess] = useState("");
  const [minesNum, setMinesNum] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [flaggedCells, setFlaggedCells] = useState<Set<string>>(new Set());

  const handleStartGame = () => {
    if (inputText && !isNaN(Number(inputText))) {
      const numMines = parseInt(inputText);

      if (numMines >= 4 && numMines <= 62) {
        setInputText("");
        setMinesNum(inputText);
        const mineCoordinates: [number, number][] = [];
        while (mineCoordinates.length < numMines) {
          const row = Math.floor(Math.random() * numRows);
          const col = Math.floor(Math.random() * numCols);
          if (!mineCoordinates.some(([r, c]) => r === row && c === col)) {
            mineCoordinates.push([row, col]);
          }
        }
        setMines(mineCoordinates);
        setGameStarted(true);
        setGameSuccess("");
        startTimer();
        setFlaggedCells(new Set());
        setElapsedTime(0);
      } else {
        alert("4 이상 62 이하의 숫자를 입력하세요.");
      }
    } else {
      alert("숫자를 입력하세요.");
    }
  };

  useEffect(() => {
    // 게임 시작 상태일 때만 지뢰를 배치하도록 수정
    if (gameStarted) {
      const initialGrid: Cell[][] = Array(numRows)
        .fill(0)
        .map(() =>
          Array(numCols).fill({ isMine: false, isOpen: false, count: 0 })
        );

      // 지뢰 표시 코드 추가
      for (const [row, col] of mines) {
        initialGrid[row][col] = { ...initialGrid[row][col], isMine: true };
      }

      setGrid(initialGrid);
    }
  }, [gameStarted, mines]);

  const startTimer = () => {
    if (!timerInterval) {
      const intervalId = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
      setTimerInterval(intervalId);
    }
  };

  useEffect(() => {
    // 게임이 종료되면 타이머 중지
    if (gameSuccess === "true" || gameSuccess === "false") {
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }
  }, [gameSuccess]);

  const calculateSurroundingMineCount = (row: number, col: number): number => {
    const directions: [number, number][] = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    let mineCount = 0;
    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (
        newRow >= 0 &&
        newRow < numRows &&
        newCol >= 0 &&
        newCol < numCols &&
        grid[newRow][newCol].isMine
      ) {
        mineCount++;
      }
    }

    return mineCount;
  };
  const toggleFlag = (row: number, col: number) => {
    if (!grid[row][col].isOpen) {
      const cellKey = `${row}-${col}`;
      const updatedFlaggedCells = new Set(flaggedCells);

      if (flaggedCells.has(cellKey)) {
        updatedFlaggedCells.delete(cellKey);
      } else {
        updatedFlaggedCells.add(cellKey);
      }

      setFlaggedCells(updatedFlaggedCells);
    }
  };

  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((cell, colIndex) => (
          <TouchableOpacity
            key={`${rowIndex}-${colIndex}`}
            style={[
              styles.cell,
              cell.isOpen && styles.openCell,
              cell.isMine && styles.mine,
            ]}
            onPress={() => handleCellPress(rowIndex, colIndex)}
            onLongPress={() => toggleFlag(rowIndex, colIndex)}
          >
            {cell.isOpen && !cell.isMine && cell.count > 0 && (
              <Text style={styles.cellText}>{cell.count}</Text>
            )}
            {gameSuccess === "true" ? (
              cell.isMine && <Text>🎉</Text>
            ) : gameSuccess === "false" ? (
              cell.isMine && <Text>💣</Text>
            ) : flaggedCells.has(`${rowIndex}-${colIndex}`) ? (
              <Text>🚩</Text>
            ) : cell.isMine ? (
              <Text></Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  const handleCellPress = (row: number, col: number) => {
    const isMine = mines.some(([r, c]) => r === row && c === col);
    const updatedGrid = [...grid];

    if (!grid[row][col].isOpen) {
      updatedGrid[row][col] = { ...updatedGrid[row][col], isOpen: true };

      if (!isMine) {
        const mineCount = calculateSurroundingMineCount(row, col);
        updatedGrid[row][col] = { ...updatedGrid[row][col], count: mineCount };

        // 주변의 빈 타일을 검사하고 공개
        if (mineCount === 0) {
          const directions: [number, number][] = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
          ];

          for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;
            if (
              newRow >= 0 &&
              newRow < numRows &&
              newCol >= 0 &&
              newCol < numCols
            ) {
              handleCellPress(newRow, newCol);
            }
          }
        }
      } else {
        alert("실패하셨습니다.");
        setInputText("");
        setMines([]);
        setGameStarted(false);
        setGameSuccess("false");
        setElapsedTime(0);
      }

      setGrid(updatedGrid);
      // 남은 타일과 지뢰 계수가 같으면 축하 알람 띄우고 초기화
      const remainingTiles = numRows * numCols - mines.length;
      const revealedTiles = updatedGrid
        .flat()
        .filter((cell) => cell.isOpen).length;

      if (remainingTiles === revealedTiles) {
        alert("축하합니다. 성공하셨습니다!");
        setInputText("");
        setMines([]);
        setGameStarted(false);
        setGameSuccess("true");
        setElapsedTime(0);
      }
    }
  };

  return (
    <DismissKeyboardView>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="4 이상 62 이하 입력 가능"
            onChangeText={(text) => {
              const cleanedText = text.replace(/[^0-9]/g, "");
              setInputText(cleanedText);
            }}
            value={inputText}
            editable={editable}
            keyboardType="numeric"
          />
          <Button title="게임 시작" onPress={handleStartGame} />
        </View>
        <View style={styles.information}>
          <Text>지뢰 개수 : {minesNum === "" ? "0" : minesNum}개</Text>
          <Text style={styles.elapsedTime}>경과 시간 : {elapsedTime}초</Text>
        </View>
        {renderGrid()}
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    marginBottom: 50,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  mine: {},
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    paddingLeft: 10,
    width: 200,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginRight: 10,
  },
  openCell: {
    backgroundColor: "#ddd",
  },
  cellText: {
    color: "blue",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  information: {
    width: "100%",
    paddingLeft: 40,
    paddingTop: 20,
    paddingBottom: 20,
  },
  elapsedTime: {
    marginTop: 10,
  },
});
