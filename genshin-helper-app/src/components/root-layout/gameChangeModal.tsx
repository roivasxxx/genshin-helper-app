import { GAMES, GAME_INFO } from "@/utils/constants";
import Link from "next/link";
import { Ref, forwardRef } from "react";

const GameChangeModal = forwardRef(function GameChangeModal(
    props: { isGameModalOpen: boolean; setIsGameModalOpen: Function },
    ref: Ref<HTMLDivElement>
) {
    const { isGameModalOpen, setIsGameModalOpen } = props;

    return (
        <>
            <div
                className={`fixed top-0 left-0 w-full h-full bg-gray-600/20 text-white ${
                    isGameModalOpen ? "block" : "hidden"
                }`}
            ></div>
            {/* modal content */}
            <div
                className={`fixed w-full bg-electro-500 p-2 rounded top-0 left-0 transition-transform duration-300 ease-in-out ${
                    isGameModalOpen
                        ? "translate-y-0 z-10"
                        : "-translate-y-full z-0"
                }`}
                ref={ref}
            >
                <div className="flex flex-row items-center justify-between border-b-2 border-electro-50 pb-2">
                    <h1 className="text-2xl uppercase">Change game</h1>
                    <button
                        // className="absolute top-2 right-2"
                        onClick={() => setIsGameModalOpen(false)}
                    >
                        <svg
                            className="w-6 h-6 stroke-electro-50 hover:stroke-electro-900"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                {Object.keys(GAME_INFO).map((gameKey) => {
                    const gameInfo = GAME_INFO[gameKey as GAMES];
                    return (
                        <div key={"game-modal-link" + gameKey}>
                            <Link
                                href={`/${gameKey}`}
                                onClick={() => setIsGameModalOpen(false)}
                            >
                                <span className="hover:text-electro-900 text-xl">
                                    {gameInfo.label}
                                </span>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </>
    );
});

export default GameChangeModal;
