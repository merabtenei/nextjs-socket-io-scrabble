"use client"

import { useContext } from "react";
import { GameContext } from "../app/game-context";
import { CurrentPlayerContext } from "../app/current-player-context";
import { Button } from "antd";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export function PlayButton({ socket, gameId }: { gameId: string, socket?: Socket<DefaultEventsMap, DefaultEventsMap> | null }) {
    const game = useContext(GameContext);
    const { player } = useContext(CurrentPlayerContext);

    return <Button
        type="primary"
        onClick={() => {
            if (player) {
                socket?.emit('play', { player, gameId, board: game.board, bucket: game.buckets[player] });
            }
        }}
    >
        Jouer
    </Button>
}