import { Server } from "socket.io";
import { getRandomLetters } from "../../app/logic";
import { BOARD_SIZE, NUM_LETTERS } from "../../app/config";

let gameStore: Record<string, any> = {};

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Server already started!");
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    cors: {
      origin: "*",
    },
    path: "/api/socket_io",
    addTrailingSlash: false,
  });

  io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  io.on("connection", (socket) => {
    console.log("connection *****");
    // Wait for getGame from client
    socket.on("getGame", (payload) => {
      console.log(`getGame ${typeof payload} ${payload}`);
      console.log(`${payload.player} requested game: ${payload.gameId}`);
      socket.join(payload.gameId);
      // if game does not exist, create it
      if (!gameStore[payload.gameId]) {
        console.log(`Game not found creating one`);
        gameStore[payload.gameId] = {
          player1: payload.player,
          turn: payload.player,
          board: Array.from(Array(BOARD_SIZE), () => new Array(BOARD_SIZE)),
          buckets: {
            [payload.player]: getRandomLetters(NUM_LETTERS),
          },
        };
      }
      // otherwise send game data to socket
      console.log(`Game ${payload.gameId} found`);
      if (
        gameStore[payload.gameId].player2 == undefined &&
        gameStore[payload.gameId].player1 != payload.player
      ) {
        console.log(`New player 2`);
        gameStore[payload.gameId] = {
          ...gameStore[payload.gameId],
          buckets: {
            ...gameStore[payload.gameId].buckets,
            [payload.player]: getRandomLetters(NUM_LETTERS),
          },
          player2: payload.player,
        };
      }
      io.to(payload.gameId).emit("gameState", gameStore[payload.gameId]);
    });

    socket.on("swapAll", (payload) => {
      console.log(`swapAll requested by ${payload.player}`);
      const gameState = gameStore[payload.gameId];
      console.log(`Current turn is ${gameState.turn}`);
      if (gameState.turn != payload.player) return;
      gameStore[payload.gameId] = {
        ...gameState,
        turn:
          payload.player == gameState.player1
            ? gameState.player2
            : gameState.player1,
        buckets: {
          ...gameState.buckets,
          [payload.player]: getRandomLetters(NUM_LETTERS),
        },
      };
      io.to(payload.gameId).emit("gameState", gameStore[payload.gameId]);
    });

    socket.on("play", (payload) => {
      console.log(`play requested by ${payload.player}`);
      const gameState = gameStore[payload.gameId];
      console.log(`Current turn is ${gameState.turn}`);
      if (gameState.turn != payload.player) return;
      gameStore[payload.gameId] = {
        ...gameState,
        turn:
          payload.player == gameState.player1
            ? gameState.player2
            : gameState.player1,
        board: payload.board,
        buckets: {
          ...gameState.buckets,
          [payload.player]: payload.bucket,
        },
      };
      io.to(payload.gameId).emit("gameState", gameStore[payload.gameId]);
    });

    console.log("A user connected");

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  res.socket.server.io = io;

  console.log("Socket server started successfully!");
  res.end();
}
