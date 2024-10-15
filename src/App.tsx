import React, { useState, useEffect } from "react";
import "./App.css";
import TicTacToe from "./tictactoe";
import Snake from "./snake";

const enum Game {
    None,
    TicTacToe,
    Snake,
}

function App() {
    const [game, setGame] = useState(Game.None);
    let gameJSX = <div />;
    switch (game) {
        case Game.None:
            gameJSX = <div />;
            break;
        case Game.TicTacToe:
            gameJSX = <TicTacToe />;
            break;
        case Game.Snake:
            gameJSX = <Snake />;
            break;
    }
    return (
        <div>
            <div>
                <button onClick={() => setGame(Game.TicTacToe)}>
                    TicTacToe
                </button>
                <button onClick={() => setGame(Game.Snake)}>Snake</button>
            </div>
            {gameJSX}
        </div>
    );
}

export default App;
