import React, { useState, useEffect, useRef } from "react";
import "./snake.css";

const { floor, random } = Math;

const width = 500;
const height = 500;

const squareWidth = 20;
const squareHeight = 20;

const boundDiv = 2;

const boundWidth = floor(squareWidth / boundDiv);
const boundHeight = floor(squareHeight / boundDiv);

const colors = ["red", "blue", "green", "purple", "black", "cyan", "orange"];

function getRandomColor() {
    return colors[floor(random() * colors.length)];
}

function drawSquare(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string
) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, squareWidth, squareHeight);
}

interface Reset extends CanvasRenderingContext2D {
    reset: () => void;
}

function clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, width, height);
    (ctx as Reset).reset();
}

interface XY {
    x: number;
    y: number;
}

function getRandomXY() {
    return {
        x: floor(random() * (width - squareWidth * 2)) + squareWidth,
        y: floor(random() * (height - squareHeight * 2)) + squareHeight,
    };
}

function drawRandomSquares(ctx: CanvasRenderingContext2D, count: number) {
    while (count > 0) {
        const { x, y } = getRandomXY();
        drawSquare(ctx, x, y, getRandomColor());
        count--;
    }
}

function gameIntro(ctx: CanvasRenderingContext2D) {
    clearCanvas(ctx);
    drawRandomSquares(ctx, 100);
    ctx.font = "48px serif";
    ctx.fillStyle = getRandomColor();
    ctx.fillText("Press Any Key", floor(width / 2) - 130, floor(height / 2));
}

enum MoveDirection {
    UP = "ArrowUp",
    DOWN = "ArrowDown",
    LEFT = "ArrowLeft",
    RIGHT = "ArrowRight",
}

function getNextSquare(squares: XY[]) {
    // TODO find better way
    let newSquare = getRandomXY();
    while (true) {
        let i = 0;
        for (let i = 0; i < squares.length; i++) {
            if (newSquare.x == squares[i].x && newSquare.y == squares[i].y)
                break;
        }
        if (i !== squares.length) break;
        newSquare = getRandomXY();
    }
    return newSquare;
}

function updateSquares(squares: XY[], updateX: number, updateY: number) {
    let prevX = squares[0].x;
    let prevY = squares[0].y;
    squares[0].x += updateX;
    squares[0].y += updateY;
    for (let i = 1; i < squares.length; i++) {
        let tmpx = squares[i].x;
        let tmpy = squares[i].y;
        squares[i].x = prevX;
        squares[i].y = prevY;
        prevX = tmpx;
        prevY = tmpy;
    }
}

function drawSquares(
    ctx: CanvasRenderingContext2D,
    squares: XY[],
    color: string
) {
    squares.forEach(({ x, y }) => drawSquare(ctx, x, y, color));
}

function cmpSquares(squareA: XY, squareB: XY) {
    const { x: ax, y: ay } = squareA;
    const { x: bx, y: by } = squareB;
    const upperBound = by - boundHeight;
    const lowerBound = by + boundHeight;
    const leftBound = bx - boundWidth;
    const rightBound = bx + boundWidth;
    if (
        ax >= leftBound &&
        ax <= rightBound &&
        ay >= upperBound &&
        ay <= lowerBound
    )
        return true;
    return false;
}

function checkCollision(squares: XY[]) {
    const root = squares[0];
    if (root.x <= 0 || root.x >= width || root.y <= 0 || root.y >= height)
        return true;
    for (let i = 1; i < squares.length; i++) {
        if (cmpSquares(root, squares[i])) return true;
    }
    return false;
}

function Snake() {
    const [start, setStart] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const startGame = () => setStart(true);

    useEffect(() => {
        const { current } = canvasRef;
        if (!current) return;
        const ctx = current.getContext("2d");
        if (!ctx) return;
        let interval: ReturnType<typeof setTimeout> | undefined;

        const mainScreen = () => {
            gameIntro(ctx);
            interval = setTimeout(() => requestAnimationFrame(mainScreen), 100);
        };

        if (!start) {
            mainScreen();
            window.addEventListener("keyup", startGame);
            return () => {
                if (interval) clearInterval(interval);
                window.removeEventListener("keyup", startGame);
            };
        }

        let score = 0;
        const squares = [{ x: floor(width / 2), y: floor(height / 2) }];
        let nextSquare = getNextSquare(squares);
        let moveDirection = MoveDirection.UP;

        const updateDirection = (e: KeyboardEvent) => {
            switch (e.key) {
                case MoveDirection.UP:
                    moveDirection = MoveDirection.UP;
                    break;
                case MoveDirection.DOWN:
                    moveDirection = MoveDirection.DOWN;
                    break;
                case MoveDirection.LEFT:
                    moveDirection = MoveDirection.LEFT;
                    break;
                case MoveDirection.RIGHT:
                    moveDirection = MoveDirection.RIGHT;
                    break;
            }
        };

        window.addEventListener("keydown", updateDirection);

        let color = getRandomColor();

        const tick = () => {
            clearCanvas(ctx);
            switch (moveDirection) {
                case MoveDirection.UP:
                    updateSquares(squares, 0, -squareHeight);
                    break;
                case MoveDirection.DOWN:
                    updateSquares(squares, 0, squareHeight);
                    break;
                case MoveDirection.LEFT:
                    updateSquares(squares, -squareWidth, 0);
                    break;
                case MoveDirection.RIGHT:
                    updateSquares(squares, squareWidth, 0);
                    break;
            }

            drawSquare(ctx, nextSquare.x, nextSquare.y, color);
            drawSquares(ctx, squares, color);

            if (interval && checkCollision(squares)) {
                clearInterval(interval);
                ctx.font = "48px serif";
                ctx.fillStyle = getRandomColor();
                ctx.fillText(
                    `Game Over Score ${score}`,
                    floor(width / 8),
                    floor(height / 2)
                );
                setTimeout(() => setStart(false), 1000);
            } else if (cmpSquares(squares[0], nextSquare)) {
                score++;
                squares.push(nextSquare);
                nextSquare = getNextSquare(squares);
                color = getRandomColor();
            }

            interval = setTimeout(() => requestAnimationFrame(tick), 100);
        };

        tick();

        return () => {
            if (interval) clearInterval(interval);
            window.removeEventListener("keydown", updateDirection);
        };
    }, [start, canvasRef]);

    return (
        <canvas
            className="snake-canvas"
            width={width}
            height={height}
            ref={canvasRef}
        />
    );
}

export default Snake;
