"use client";

import LoadingLogo from "../loadingLogo";
import { GameAccountState, useAccount } from "./accountProvider";
import Image from "next/image";
import GenshinPreview from "./genshin/genshinPreview";

function GameAccountPreview(props: { game: GameAccountState }) {
    const gameState = props.game;
    return (
        <div className="w-full h-auto">
            <Image
                src={`/images/games/icons/${gameState.game}.png`}
                alt={"game-icon-" + gameState.game}
                width="0"
                height="0"
                sizes="100vw"
                className="w-full h-auto rounded-md"
                priority
            />
        </div>
    );
}

export default function AccountInfo() {
    const { state } = useAccount();

    return (
        <div className="w-full flex flex-col bg-electro-800 rounded bg-electro-800 rounded min-h-[10rem] p-2">
            {state.loading ? (
                <div className="w-full flex items-center justify-center">
                    <LoadingLogo size="size-40" />
                </div>
            ) : (
                <div className="w-full flex flex-col">
                    <h1 className="text-2xl text-wrap break-words ">
                        Welcome, {state.email}!
                    </h1>
                    <hr className="my-2 border-[0.12rem] rounded px-2" />
                    <h2 className="text-xl">Your Game Accounts</h2>
                    <GenshinPreview />
                </div>
            )}
        </div>
    );
}
