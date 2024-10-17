import React, { useState, useEffect } from "react";
import "./App.css";
import TicTacToe from "./tictactoe";
import Snake from "./snake";

enum Game {
    None = "None",
    TicTacToe = "TicTacToe",
    Snake = "Snake",
}

const games = {
    [Game.None]: <div />,
    [Game.TicTacToe]: <TicTacToe />,
    [Game.Snake]: <Snake />,
};

function App() {
    const [game, setGame] = useState(Game.None);
    let gameJSX = games[game];
    return (
        <div>
            <div>
                {Object.keys(games).map((gName) => (
                    <button key={gName} onClick={() => setGame(gName as Game)}>
                        {gName}
                    </button>
                ))}
            </div>
            {gameJSX}
        </div>
    );
}

export default App;
