"use client";

import { useContext } from "react";
import { GameContext } from "../app/game-context";
import { CurrentPlayerContext } from "../app/current-player-context";
import { Draggable } from "./draggable";
import { Button } from "antd";

export function Bucket() {
    const { player } = useContext(CurrentPlayerContext);
    const buckets = useContext(GameContext).buckets;
    const bucket = player ? buckets[player] ?? [] : [];
    return <div className="flex flex-wrap">
        {
            bucket.map(
                (item, index) => <Draggable key={`${index}-${item}`} id={`${index}-${item}`} data={{ value: item }}>
                    {
                        ({ isDragging }) => <Button
                            className="w-8 mx-2 my-1 flex items-center justify-center"
                            style={{ padding: 0 }}
                        //type={isDragging ? 'primary' : 'default'}
                        >
                            {item}
                        </Button>
                    }
                </Draggable>
            )}
    </div>
}