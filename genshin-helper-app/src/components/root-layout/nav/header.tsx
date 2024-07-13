"use client";
import useClickOutside from "@/utils/hooks/useClickOutside";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavItems from "./navItems";
import GameChangeModal from "../gameChangeModal";
import UserIcon from "./userIcon";

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
    } = useClickOutside(false, undefined, ["hamburger"]);

    const pathName = usePathname()?.split("/")[2] || "";

    return (
        <header className="bg-electro-800 md:rounded font-exo text-electro-50 fixed top-0 w-full z-50">
            <nav className="w-full flex items-center">
                <div className="w-full h-16 flex flex-row items-center justify-between px-2">
                    <div className="w-36 h-full flex flex-row items-center">
                        <div
                            className="inline md:hidden px-2"
                            onClick={() => {
                                setIsMobileMenuOpen(!isMobileMenuOpen);
                            }}
                        >
                            <div
                                className="grid justify-items-center gap-1.5"
                                id="hamburger"
                            >
                                <span className="block h-0.5 w-6 bg-electro-50" />
                                <span className="block h-0.5 w-6 bg-electro-50" />
                                <span className="block h-0.5 w-6 bg-electro-50" />
                            </div>
                        </div>
                        <Link
                            href="/game/genshin-impact"
                            className="h-full flex flex-row items-center shrink-0 text-electro-50 font-bebas hover:text-electro-500"
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
                                <span className="hidden md:inline text-2xl">
                                    Electro Mains
                                </span>
                            </>
                        </Link>
                    </div>
                    <div
                        className={`absolute top-16 left-0 w-full pb-1 items-center bg-electro-800 ${
                            !isMobileMenuOpen ? "hidden" : ""
                        } md:flex md:static md:h-full md:w-auto`}
                    >
                        {/* content */}
                        <NavItems />
                    </div>
                    <div className="flex flex-row items-center">
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
                        <UserIcon />
                    </div>
                </div>
            </nav>

            <GameChangeModal
                isGameModalOpen={isGameModalOpen}
                setIsGameModalOpen={setIsGameModalOpen}
                ref={gameModalRef}
            />
        </header>
    );
}
