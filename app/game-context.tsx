"use client";

import { createContext, useState } from "react";

export type GameContextType = {
    player1?: string | undefined;
    setPlayer1?: (turn: string) => void;
    player2?: string | undefined;
    setPlayer2?: (turn: string) => void;
    turn?: string | undefined;
    setTurn: (turn: string) => void;
    scores: Record<string, number>;
    setScores: (scores: Record<string, number>) => void;
    buckets: Record<string, string[]>;
    setBuckets: (buckers: Record<string, string[]>) => void;
    board: string[][];
    setBoard: (state: string[][]) => void;
}

export const GameContext = createContext<GameContextType>({
    turn: undefined,
    setTurn: () => { },
    scores: {},
    setScores: () => { },
    buckets: {},
    setBuckets: () => { },
    board: [],
    setBoard: () => { }
});

export function GameContextProvider({ children, initial }: any) {
    const [turn, setTurn] = useState<string | undefined>(initial?.turn);
    const [player1, setPlayer1] = useState<string | undefined>(initial?.player1);
    const [player2, setPlayer2] = useState<string | undefined>(initial?.player2);
    const [scores, setScores] = useState<Record<string, number>>(initial?.scores ?? {});
    const [buckets, setBuckets] = useState<Record<string, string[]>>(initial?.buckets ?? {});
    const [board, setBoard] = useState<string[][]>(initial?.board ?? Array.from(Array(15), () => new Array(15)));

    return <GameContext.Provider value={{
        turn,
        setTurn,
        player1,
        setPlayer1,
        player2,
        setPlayer2,
        scores,
        setScores,
        buckets,
        setBuckets,
        board,
        setBoard
    }}>
        {children}
    </GameContext.Provider>
}