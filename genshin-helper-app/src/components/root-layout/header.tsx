"use client";
import navConfig from "@/nav-config";
import { GAMES, GAME_INFO } from "@/utils/constants";
import useClickOutside from "@/utils/hooks/useClickOutside";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {
        ref,
        isVisible: isGameModalOpen,
        setVisibility: setIsGameModalOpen,
    } = useClickOutside(false);

    const pathName = usePathname();

    return (
        <header className="bg-electro-800 rounded font-exo text-electro-50">
            <nav className="w-full flex items-center">
                <div className="w-full h-16 flex flex-row items-center justify-between px-2">
                    <div className="w-36 h-full flex flex-row items-center">
                        <div
                            className="inline md:hidden px-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <div className="grid justify-items-center gap-1.5">
                                <span className="block h-0.5 w-6 bg-electro-50" />
                                <span className="block h-0.5 w-6 bg-electro-50" />
                                <span className="block h-0.5 w-6 bg-electro-50" />
                            </div>
                        </div>
                        <Link
                            href="/genshin-impact"
                            className="h-full flex flex-row items-center shrink-0"
                        >
                            <>
                                <div className="size-7 md:size-9">
                                    <Image
                                        src="/images/logo.svg"
                                        alt="Electro Mains"
                                        width="0"
                                        height="0"
                                        sizes="100vw"
                                        className="w-full h-auto"
                                        priority
                                    />
                                </div>
                                <span className="text-electro-50 hidden md:inline text-xl">
                                    Electro Mains
                                </span>
                            </>
                        </Link>
                    </div>
                    <div className="hidden md:flex h-full items-center">
                        {/* content */}
                        {pathName &&
                        pathName.replaceAll("/", "") in navConfig ? (
                            <>
                                {navConfig[
                                    pathName.replaceAll("/", "") as GAMES
                                ].paths.map((path) => {
                                    if (path.subpaths) {
                                        return (
                                            <div
                                                key={pathName + path.path}
                                                className="w-full h-full group relative px-6 hover:cursor-pointer"
                                            >
                                                <div className="w-full h-full flex items-center hover:text-electro-500">
                                                    {path.label}
                                                </div>
                                                <div className="absolute hidden group-hover:block bg-electro-800 py-2 px-4">
                                                    {path.subpaths.map(
                                                        (subpath) => (
                                                            <div
                                                                key={
                                                                    pathName +
                                                                    path.path +
                                                                    subpath.path
                                                                }
                                                            >
                                                                <Link
                                                                    href={
                                                                        pathName +
                                                                        path.path +
                                                                        subpath.path
                                                                    }
                                                                    className="py-2 hover:text-electro-500"
                                                                >
                                                                    {
                                                                        subpath.label
                                                                    }
                                                                </Link>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return (
                                        <Link
                                            key={pathName + path.path}
                                            href={pathName + path.path}
                                            className=" hover:text-electro-500 px-6 w-full h-full flex items-center"
                                        >
                                            {path.label}
                                        </Link>
                                    );
                                })}
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="flex flex-row">
                        <div
                            onClick={() => setIsGameModalOpen(true)}
                            className="size-7 md:size-9 hover:cursor-pointer"
                        >
                            {pathName ? (
                                <Image
                                    src={`/images/games/icons${pathName}.png`}
                                    alt={"game-icon-" + pathName}
                                    width="0"
                                    height="0"
                                    sizes="100vw"
                                    className="w-full h-auto rounded-md"
                                    priority
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                        <div>user avatar</div>
                    </div>
                </div>
                {isMenuOpen ? (
                    <div className="flex w-full flex-col md:hidden">
                        <div>
                            <Link href="#">Test</Link>
                        </div>
                        <div>
                            <Link href="#">Test</Link>
                        </div>
                        <div>
                            <Link href="#">Test</Link>
                        </div>
                        <div>
                            <Link href="#">Test</Link>
                        </div>
                    </div>
                ) : (
                    <></>
                )}

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
            </nav>
        </header>
    );
}
