import React, { useState, useEffect } from "react";
import "./App.css";
import HN from "./hn";
import TicTacToe from "./tictactoe";
import Snake from "./snake";

enum Game {
    HN = "HN",
    TicTacToe = "TicTacToe",
    Snake = "Snake",
}

const games = {
    [Game.HN]: <HN maxItems={100} maxItemsPerPage={20} />,
    [Game.TicTacToe]: <TicTacToe />,
    [Game.Snake]: <Snake />,
};

function App() {
    const [game, setGame] = useState(Game.HN);
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
