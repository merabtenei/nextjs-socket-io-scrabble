import { CurrentPlayerContextProvider } from "../current-player-context";
import { GameContextProvider } from "../game-context";
import { cookies } from 'next/headers'

export default function Layout({ children }) {
    const cookieStore = cookies();
    return <CurrentPlayerContextProvider initial={cookieStore.get('player')?.value}>
        <GameContextProvider>
            {children}
        </GameContextProvider>
    </CurrentPlayerContextProvider>
}