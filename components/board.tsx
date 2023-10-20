"use client";

import { ReactNode, useContext, useMemo } from "react";
import { CurrentPlayerContext } from "../app/current-player-context";
import { GameContext } from "../app/game-context";
import { DndComponent } from "./dnd-component";
import { BOARD_SIZE } from "../app/config";

export function Board({ className }) {
    const { player } = useContext(CurrentPlayerContext);
    const board = useContext(GameContext).board;

    const cells = useMemo<ReactNode[]>(() => {
        const cells: ReactNode[] = [];
        board.forEach((row, rowIndex) => {
            row.map((col, colIndex) => {
                cells.push(<DndComponent
                    className="aspect-square"
                    key={`${rowIndex}-${colIndex}`}
                    id={`${rowIndex}-${colIndex}`}
                    data={{ row: rowIndex, col: colIndex }}
                >
                    {
                        ({ isOver, isDragging }) => {
                            return <div
                                key={`inner-${rowIndex}-${colIndex}`}
                                className="w-full h-full bg-gray-100 flex items-center justify-center rounded-sm font-bold border border-solid border-gray-500"
                                style={{
                                    padding: 0,
                                    backgroundColor: colIndex == Math.floor(BOARD_SIZE / 2) && rowIndex == Math.floor(BOARD_SIZE / 2) ? '#c4c4fe' : undefined
                                }}
                            //type={isDragging ? 'primary' : 'default'}
                            >
                                {board[rowIndex][colIndex]}
                                {/* {colIndex}/{rowIndex} */}
                            </div>;
                        }
                    }
                </DndComponent>);
            });
        });
        return cells;
    }, [board]);

    return <div className={`w-full grid gap-x-1 gap-y-1`}
        style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
        }}>
        {
            ...cells
        }
    </div>
}
