"use client";

import { GAMES, GAME_ACCOUNTS_IDS, GAME_ACCOUNT_ID } from "@/utils/constants";
import LoadingLogo from "../loadingLogo";
import { GameAccountState, useAccount } from "./accountProvider";
import Image from "next/image";

function GameAccountPreview(props: { game: GameAccountState }) {
    const gameState = props.game;
    return (
        <>
            <Image
                src={`/images/games/icons/${gameState.game}.png`}
                alt={"game-icon-" + gameState.game}
                width="0"
                height="0"
                sizes="100vw"
                className="w-full h-auto rounded-md"
                priority
            />
        </>
    );
}

export default function AccountInfo() {
    const { email, games, loading } = useAccount();

    return (
        <div className="w-full flex flex-col bg-electro-800 rounded bg-electro-800 rounded min-h-[10rem] p-2">
            {loading ? (
                <div className="w-full flex items-center justify-center">
                    <LoadingLogo size="size-40" />
                </div>
            ) : (
                <div className="w-full flex flex-col">
                    <h1 className="text-2xl text-wrap break-words ">
                        Welcome, {email}!
                    </h1>
                    <hr className="my-2 border-[0.12rem] rounded px-2" />
                    <h2 className="text-xl">Your Game Accounts</h2>
                    <GameAccountPreview game={games.genshin} />
                </div>
            )}
        </div>
    );
}
