# 2번 지뢰찾기

## 칸을 터치했을때 주변에 있는 지뢰의 개수가 뜨지 않습니다.

✅ 구현 완료

```tsx
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
```

## 꾹 눌렀을때 깃발이 입력되지 않습니다.

✅ 구현 완료

```tsx
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
```

## 지뢰를 눌렀을때 실패 토스트와 함께 모든 칸에 있는 지뢰를 노출해주세요.

✅ 구현 완료

```tsx
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
```

## 주변에 지뢰가 하나도 없을때 자동으로 옆에 칸들이 열려야 합니다. 숫자가 안나와서 확인하기가 어렵습니다.

✅ 구현 완료

```tsx
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
```

</br>

## 구현 기능 시연 영상

![Peek 2023-10-10 12-35](https://github.com/minsgy/minesweeper_web_game/assets/114569429/9f532408-11c1-4c9c-b8e5-cf97b2758f2e)
