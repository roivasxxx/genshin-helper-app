"use client";
import { GAMES, GAME_INFO } from "@/utils/constants";
import useClickOutside from "@/utils/hooks/useClickOutside";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import NavItems from "./navItems";
import GameChangeModal from "../gameChangeModal";

export default function Header() {
    const {
        ref: gameModalRef,
        isVisible: isGameModalOpen,
        setVisibility: setIsGameModalOpen,
    } = useClickOutside(false);

    const {
        ref: mobileNavRef,
        isVisible: isMobileMenuOpen,
        setVisibility: setIsMobileMenuOpen,
    } = useClickOutside(false);

    const pathName = usePathname()?.split("/")[1] || "";

    return (
        <header className="bg-electro-800 rounded font-exo text-electro-50 absolute top-0 w-full">
            <nav className="w-full flex items-center">
                <div className="w-full h-16 flex flex-row items-center justify-between px-2">
                    <div className="w-36 h-full flex flex-row items-center">
                        <div
                            className="inline md:hidden px-2"
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
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
                        <NavItems resolution="large" />
                    </div>
                    <div className="flex flex-row">
                        <div
                            onClick={() => setIsGameModalOpen(true)}
                            className="size-7 md:size-9 hover:cursor-pointer"
                        >
                            {pathName ? (
                                <Image
                                    src={`/images/games/icons/${pathName}.png`}
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
            </nav>

            {isMobileMenuOpen ? (
                <div
                    className="flex w-full relative flex-col py-2 md:hidden"
                    ref={mobileNavRef}
                >
                    <NavItems resolution="small" />
                </div>
            ) : (
                <></>
            )}

            <GameChangeModal
                isGameModalOpen={isGameModalOpen}
                setIsGameModalOpen={setIsGameModalOpen}
                ref={gameModalRef}
            />
        </header>
    );
}
