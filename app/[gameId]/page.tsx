"use client";

import { useContext, useEffect } from "react";
import { io, type Socket } from "socket.io-client";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Bucket } from "../../components/bucket";
import { GameContext } from "../game-context";
import { CurrentPlayerContext } from "../current-player-context";
import { SetPlayer } from "../../components/set-player";
import { Button } from "antd";
import { TbLogout } from "react-icons/tb";
import { Board } from "../../components/board";
import { PlayButton } from "../../components/play-button";

let socket: Socket | null = null;

export default function Home({ params }: { params: { gameId: string } }): JSX.Element {
  const game = useContext(GameContext);
  const { player, setPlayer } = useContext(CurrentPlayerContext);

  useEffect(() => { }, []);

  useEffect(() => {
    if (!player) return;

    if (socket) {
      socket.disconnect();
      socket = null;
    }
    void fetch("/api/socket");
    // socket = io({
    //   path: '/api/socket_io',
    //   rejectUnauthorized: false,
    // });

    socket = io({
      path: '/api/socket_io',
      rejectUnauthorized: false,
    });

    socket.on("connect", () => {
      console.log("connected");
      console.log("getGame", { player, gameId: params.gameId });
      socket?.emit("getGame", { player, gameId: params.gameId });
    });

    socket.on("gameState", ({ turn, board, buckets, player1, player2, scores }) => {
      console.log('# gameState')
      console.log(turn)
      console.log(buckets);
      console.log(board);
      game.setBoard(board);
      game.setTurn(turn);
      game.setBuckets(buckets);
      game.setPlayer1?.(player1);
      game.setPlayer2?.(player2);
      game.setScores(scores ?? {});
    });

    socket.on("userServerConnection", (data) => {
      console.log("a user connected (client):: ", data);
    });

    socket.on("userServerDisconnection", (socketid: string) => {
      console.log(socketid);
    });


    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [player]);

  return player ? (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="max-w-sm p-4 flex flex-col items-center justify-center" style={{
        height: '95vh',
      }}>
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-col text-xl font-bold">
            <span>Tour de {game.turn}</span>
            {!game.player1 || !game.player2 && <span className="text-lg">En attente du 2eme joueur</span>}
          </div>
          <Button icon={<TbLogout style={{ fontSize: '24px' }} />} onClick={() => setPlayer(undefined)} />
        </div>
        <div className="w-full flex flex-auto justify-center items-center">
          <div className="w-full aspect-square flex flex-col space-y-8">
            <Board className="" />
            <Bucket />
            <PlayButton socket={socket} gameId={params.gameId} />
          </div>
        </div>
        <div className="my-4">
          <Button onClick={() => {
            socket?.emit('swapAll', { player, gameId: params.gameId })
          }} danger>Echanger et passer mon tour</Button>
        </div>
      </div>
    </DndContext>
  ) : <SetPlayer />;

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    if (over) {
      let newBoard = game.board;
      if (over.data.current && active.data.current && !newBoard[over.data.current!.row][over.data.current!.col]) {
        if (active.data.current.value) {
          console.log('#// 1');
          newBoard[over.data.current!.row][over.data.current!.col] = active.data.current!.value;
          let bucket = game.buckets[player!];
          if (bucket.indexOf(active.data.current!.value) !== -1) {
            bucket.splice(bucket.indexOf(active.data.current!.value), 1);
          }
          game.setBuckets({ ...game.buckets, [player!]: bucket });
        } else if (active.data?.current?.col !== null && active.data?.current?.row !== null) {
          console.log('#// 2');
          newBoard[over.data.current!.row][over.data.current!.col] = newBoard[active.data.current!.row][active.data.current!.col];
          newBoard[active.data.current!.row][active.data.current!.col] = '';
        }
        game.setBoard(newBoard);
      }
    }
  }
}