import React, { useState, useEffect } from "react";
import "./tictactoe.css";

type TicTacToePlayer = "X" | "O";
type TicTacToeSquare = TicTacToePlayer | "";
type TicTacToeBoard = Array<TicTacToeSquare>;
type TicTacToeWin = Set<number> | undefined;

const clickTgt = 9;
const clickStart = 1;

function TicTacToe() {
    const [win, setWin] = useState<TicTacToeWin>();

    const [player, setPlayer] = useState<TicTacToePlayer>("X");

    const switchPlayer = () => {
        const current = player;
        setPlayer(current === "X" ? "O" : "X");
        return current;
    };

    const [board, setBoard] = useState<TicTacToeBoard>(
        new Array<TicTacToeSquare>(9).fill("")
    );

    const getSquare = (x: number, y: number) => {
        return board[y * 3 + x];
    };

    const setSquare = (x: number, y: number, v: TicTacToeSquare) => {
        board[y * 3 + x] = v;
        setBoard([...board]);
    };

    const reset = () => {
        setWin(undefined);
        setPlayer("X");
        setBoard(new Array<TicTacToeSquare>(9).fill(""));
    };

    const click = (x: number, y: number) => {
        if (win || board.filter((x) => x === "").length === 0) {
            reset();
            return;
        }
        if (getSquare(x, y) !== "") return;
        setSquare(x, y, switchPlayer());
    };

    const checkWin = (a: number, b: number, c: number) => {
        if (board[a] !== "" && board[a] === board[b] && board[b] === board[c])
            setWin(new Set([a, b, c]));
    };

    useEffect(() => {
        if (win || board.filter((x) => x === "").length === 0) return;
        // rows
        checkWin(0, 1, 2);
        checkWin(3, 4, 5);
        checkWin(6, 7, 8);
        // columns
        checkWin(0, 3, 6);
        checkWin(1, 4, 7);
        checkWin(2, 5, 8);
        // diagonal
        checkWin(0, 4, 8);
        checkWin(2, 4, 6);
    }, [board]);

    const getRow = (start: number, end: number) => (
        <div className="board-row">
            {board.slice(start, end).map((square, idx) => (
                <div
                    key={idx.toString()}
                    className={`board-square ${win?.has(start + idx) && "board-square-win"}`}
                    onClick={() => click(idx % 3, Math.floor(end / 3) - 1)}
                >
                    {square}
                </div>
            ))}
        </div>
    );

    return (
        <div className="board">
            {getRow(0, 3)}
            {getRow(3, 6)}
            {getRow(6, 9)}
        </div>
    );
}

export default TicTacToe;
