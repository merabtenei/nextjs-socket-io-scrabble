"use client";

import { Button, Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import { CurrentPlayerContext } from "../app/current-player-context";
import { useContext } from "react";
import { TbMoodSmileBeam } from "react-icons/tb";
import cookieCutter from 'cookie-cutter'

export function SetPlayer() {
    const { player, setPlayer } = useContext(CurrentPlayerContext);
    return (
        <div className="absolute top-0 left-0 z-10 transition-all duration-1000 flex items-center justify-center w-screen h-screen">
            <div className="flex flex-col space-y-4">
                <h2>Jouer en tant que :</h2>
                <Form onFinish={({ player }) => {
                    setPlayer(player);
                    console.log(`setPlayer: ${player}`);
                    cookieCutter.set('player', player);
                }}>
                    <FormItem name="player" rules={[{ required: true }]} normalize={value => (value || '').toUpperCase()}>
                        <Input placeholder="Nom" />
                    </FormItem>
                    <div className="flex items-center justify-center">
                        <Button icon={<TbMoodSmileBeam />} type="primary" htmlType="submit">Commencer</Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}