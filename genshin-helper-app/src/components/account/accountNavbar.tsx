"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import UserIcon from "../root-layout/nav/userIcon";

export default function AccountNavbar() {
    return (
        <header className="bg-electro-800 md:rounded font-exo text-electro-50 fixed top-0 w-full z-50">
            <nav className="w-full flex items-center">
                <div className="w-full h-16 flex flex-row items-center justify-between px-2">
                    <div className="w-36 h-full flex flex-row items-center">
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
                                <span className="text-2xl">Electro Mains</span>
                            </>
                        </Link>
                    </div>
                    <div className="flex flex-row items-center justify-center">
                        <UserIcon />
                        <button
                            className="relative group w-10 h-10 flex justify-center items-center"
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            <span className="absolute top-[50%] right-0 size-5 rounded-full border-electro-50 border-2 translate-x-[-50%] translate-y-[-50%] group-hover:border-electro-500 group-active:border-electro-500" />
                            <div className="absolute top-[10%] right-0 size-5 rounded-full translate-x-[-50%] translate-y-[-50%] bg-electro-800">
                                <span className="absolute bottom-0 left-[50%] h-4 w-1.5 bg-electro-50 border-electro-800 border-2 rounded translate-x-[-50%] translate-y-[40%] group-hover:bg-electro-500 group-active:bg-electro-500"></span>
                            </div>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}
