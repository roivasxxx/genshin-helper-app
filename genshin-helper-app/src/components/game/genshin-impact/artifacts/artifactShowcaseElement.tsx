"use client";
import { GenshinArtifact } from "@/types/apiResponses";
import { STAR_SYMBOL } from "@/utils/constants";
import Image from "next/image";
import React, { useState } from "react";

export default function ArtifactShowcaseElement(props: {
    artifact: GenshinArtifact;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const artifact = props.artifact;
    if (!artifact.rarity) {
        console.log(artifact);
    }
    return (
        <div
            className="flex flex-col p-2 rounded bg-electro-850 hover:bg-electro-500 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="flex flex-col items-center w-full">
                <h2 className="bold text-xl text-center">{artifact.name}</h2>
                <div className="w-16 h-16">
                    {artifact.icon ? (
                        <Image
                            src={artifact.icon}
                            alt={artifact.name}
                            width={0}
                            height={0}
                            sizes="100%"
                            className="object-contain w-full h-full"
                        />
                    ) : (
                        <></>
                    )}
                </div>
                <svg
                    className={`w-5 h-5 transition-transform duration-300 transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                </svg>
            </div>
            {/* todo, if open show extra info :D */}
            <p className="text-md">
                <span className="px-3">Rarities</span>
                {artifact.rarity.map((el) => (
                    <span
                        className="px-1"
                        key={artifact.id + "rarity" + el}
                    >{`${el} ${STAR_SYMBOL}`}</span>
                ))}
            </p>
        </div>
    );
}
