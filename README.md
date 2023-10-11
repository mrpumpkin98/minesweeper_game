## 💥 React Native 지뢰찾기 게임

```
  🔍 지뢰찾기 게임을 엡을 통해 즐길 수 있어요.
  🎟 타이머를 통해 게임 클리어 시간을 확인 할 수 있어요.
```

## 프로젝트 실행

```text
  npm install
  yarn install
```

```json
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web"
```

## 기술 스택

- `TypeScript`와 `React 18.2.0`, `React-native 0.72.5`을 활용했습니다.
- 게임 보드 관리를 `recoil` 전역 상태 라이브러리를 활용하여 사용 할 수 있도록 설계했어요.
- `CSS-in-JS` 방식의 `styled-components`를 활용하였습니다.

## 구현 리스트


- **요구 사항**
    - 사용자는 시작 시 게임 보드의 크기와 지뢰의 수를 설정
    - 가장 상단에는 경과 시간을 표시
- **게임 진행**
    - 사용자가 지뢰가 있는 셀을 터치하면 게임은 종료.
    - 지뢰가 없는 셀을 터치할 때 주변의 지뢰가 없는 셀들을 자동으로 열어주는 기능을 구현
    - 사용자는 셀을 길게 눌러서 해당 셀에 플래그(🚩)를 설치
- **난이도 설정**
    - 스마일 이모지를 누르면 바텀 시트가 올라오고 “다시 시작하기”, “Beginner”, “Intermediate”, “Expert” 버튼을 제공해 난이도 변경이 가능
    - 각 난이도는 게임 보드의 크기와 지뢰의 수를 변경하여 구성
        - Beginner (8x8)
        - Intermediate (10x14)
        - Expert (14x32)
- **게임 결과**
    - **결과 표시**
        - 게임 종료 시, 승리 또는 패배에 따라 사용자에게 결과를 알려준다
            - Alert를 통해서 사용자에게 결과값을 보여준다
         
## 구현 상세 내용

1. 칸을 터치했을때 주변에 있는 지뢰의 개수가 확인

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
</br>

2. 길게 눌렀을때 깃발이 입력

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
</br>

3. 지뢰를 눌렀을때 실패 토스트와 함께 모든 칸에 있는 지뢰를 노출

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
</br>

4. 주변에 지뢰가 하나도 없을때 자동으로 옆에 칸들이 열리고 지뢰 숫자 확인

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

