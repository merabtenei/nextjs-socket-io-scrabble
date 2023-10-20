"use client";

import { createContext, useEffect, useState } from "react";

export type CurrentPlayerContextType = {
    player: string | undefined;
    setPlayer: (player: string | undefined) => void;
};

export const CurrentPlayerContext = createContext<CurrentPlayerContextType>({
    player: undefined,
    setPlayer: () => { }
});

export function CurrentPlayerContextProvider({ children, initial }) {
    const [player, setPlayer] = useState<string | undefined>(initial);

    return <CurrentPlayerContext.Provider value={{ player, setPlayer }}>
        {children}
    </CurrentPlayerContext.Provider>
}