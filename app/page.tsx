"use client";
import Head from "next/head";
import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";
import { Button } from "antd";

let socket: Socket | null = null;

export default function Home(): JSX.Element {
  useEffect(() => {
    if (!socket) {
      void fetch("/api/socket");
      socket = io({ path: '/api/socket_io' });

      socket.on("connect", () => {
        console.log("connected");
      });

      socket.on("hello", (msg: string) => {
        console.log("hello", msg);
      });

      socket.on("userServerConnection", () => {
        console.log("a user connected (client)");
      });

      socket.on("userServerDisconnection", (socketid: string) => {
        console.log(socketid);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);
  return (
    <>
      <main>
        <Button
          onClick={() => socket?.emit("hello", "kitty")}
        >
          Send Hello {'"'}Kitty{'"'}
        </Button>
        <Button>Create a chatroom</Button>
        <Button>Join a chatroom</Button>
      </main>
    </>
  );
}