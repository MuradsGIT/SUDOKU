/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./App.scss";
import { CiEraser } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";

function App() {
  const emptyGrid = Array.from({ length: 9 }, () => Array(9).fill(0));
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [grid, setGrid] = useState(emptyGrid);
  const [error, setError] = useState("");
  const handleChange = (row, col, value) => {
    if (/^\d?$/.test(value)) {
      const newGrid = [...grid];
      newGrid[row][col] = value;
      setGrid(newGrid);
    } else {
      const newGrid = [...grid];
      newGrid[row][col] = 0;
      setGrid(newGrid);
    }
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSolving = async () => {
    if (!isValid(grid)) {
      setError("Invalid Sudoku.");
      return;
    }
    setError("");
    setGrid(emptyGrid);
    await solveSudoku(grid, 9);
  };
  const isValid = (board) => {
    const seen = new Set();

    // Check rows and columns
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const rowKey = `row-${i}-${board[i][j]}`;
        const colKey = `col-${j}-${board[i][j]}`;

        if (board[i][j] !== 0 && (seen.has(rowKey) || seen.has(colKey))) {
          return false;
        }

        seen.add(rowKey);
        seen.add(colKey);
      }
    }

    // Check subgrids
    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        seen.clear(); // Reset set for each subgrid

        for (let x = i; x < i + 3; x++) {
          for (let y = j; y < j + 3; y++) {
            const subgridKey = `subgrid-${x}-${y}-${board[x][y]}`;

            if (board[x][y] !== 0 && seen.has(subgridKey)) {
              console.log("Not solvable. Duplicate number in subgrid.");
              return false;
            }

            seen.add(subgridKey);
          }
        }
      }
    }

    return true;
  };

  function isSafe(board, row, col, num) {
    // Check row
    for (let i = 0; i < board.length; i++) {
      if (board[row][i] == num) {
        return false;
      }
    }

    // Check col
    for (let i = 0; i < board.length; i++) {
      if (board[i][col] == num) {
        return false;
      }
    }

    // 3X3 cube
    let sqrt = Math.floor(Math.sqrt(board.length));
    let boxRowStart = row - (row % sqrt);
    let boxColStart = col - (col % sqrt);

    for (let r = boxRowStart; r < boxRowStart + sqrt; r++) {
      for (let d = boxColStart; d < boxColStart + sqrt; d++) {
        if (board[r][d] == num) {
          return false;
        }
      }
    }
    return true;
  }
  const solveSudoku = async (board, n) => {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (board[i][j] === 0) {
          setGrid([...board]);
          await sleep(1); // Delay

          for (let num = 1; num <= 9; num++) {
            if (isSafe(board, i, j, num)) {
              const newBoard = [...board];
              newBoard[i] = [...newBoard[i]];
              newBoard[i][j] = num;

              if (await solveSudoku(newBoard, n)) {
                return true;
              } else {
                newBoard[i][j] = 0;
              }
            }
          }

          return false;
        }
      }
    }
    setGrid([...board]);
    return true;
  };

  return (
    <div className="App">
      <div className="sudoku-container">
        <header>Sudoku</header>
        <div className="sudoku-grid">
          {grid.map((row, rowInd) => (
            <div
              key={rowInd}
              className={`sudoku-row ${
                rowInd % 3 === 2 ? "bottom-border" : ""
              }`}
            >
              {row.map((col, colInd) => (
                <input
                  key={colInd}
                  type="number"
                  maxLength={1}
                  className={`sudoku-cell ${
                    colInd % 3 === 2 ? "right-border" : ""
                  }`}
                  value={col || ""}
                  onChange={(e) => handleChange(rowInd, colInd, e.target.value)}
                />
              ))}
            </div>
          ))}
        </div>

        <h2>{error}</h2>
        <div className="actions">
          <div className="erase">
            {" "}
            <p
              onClick={() => {
                setGrid(emptyGrid), setError("");
              }}
            >
              {" "}
              <CiEraser />
            </p>
            <label htmlFor="">Clear</label>
          </div>
          <div className="solve">
            <p onClick={() => handleSolving()}>
              <FaCheck />
            </p>
            <span>Solve</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
