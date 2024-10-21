import React, { useState } from "react";
import "./App.css";
import HN from "./hn";
import TicTacToe from "./tictactoe";
import Snake from "./snake";
import { classNames } from "./util";

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
    const [game, setGame] = useState(Game.TicTacToe);
    let gameJSX = games[game];
    return (
        <div>
            <div className="game-header">
                <div className="game-buttons">
                    {Object.keys(games).map((gName) => (
                        <button
                            className={classNames({
                                "game-button": true,
                                "game-button-selected": gName === game,
                            })}
                            key={gName}
                            onClick={() => setGame(gName as Game)}
                        >
                            {gName}
                        </button>
                    ))}
                </div>
            </div>
            <div className="game-container">{gameJSX}</div>
        </div>
    );
}

export default App;
