"use client";
import ArrowToggle from "@/components/arrowToggle";
import { GenshinArtifact } from "@/types/genshinTypes";
import { STAR_SYMBOL } from "@/utils/constants";
import Image from "next/image";
import React, { ReactNode, useState } from "react";

export default function ArtifactShowcaseElement(props: {
    artifact: GenshinArtifact;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const artifact = props.artifact;

    const artifactDropLocation = () => {
        let domains = artifact.domains || [];
        let drops = [];

        if (
            artifact.id === "gladiators_finale" ||
            artifact.id === "wanderers_troupe"
        ) {
            drops.push(
                ...[
                    <li className="mb-1" key={`artifact-${artifact.id}-weekly`}>
                        World Bosses
                    </li>,
                    <li className="mb-1" key={`artifact-${artifact.id}-world`}>
                        Weekly Bosses
                    </li>,
                ]
            );
        } else if (artifact.rarity.length === 3) {
            drops.push(
                ...[
                    <li className="mb-1" key={`artifact-${artifact.id}-chests`}>
                        Chests
                    </li>,
                    <li className="mb-1" key={`artifact-${artifact.id}-elite`}>
                        Elite Enemies
                    </li>,
                    <li className="mb-1" key={`artifact-${artifact.id}-world`}>
                        World Bosses
                    </li>,
                    <li className="mb-1" key={`artifact-${artifact.id}-weekly`}>
                        Weekly Bosses
                    </li>,
                ]
            );
        } else if (artifact.rarity[1] === 4) {
            drops.push(<li>World Bosses</li>);
        }

        return [
            ...drops,
            ...domains.map((el) => (
                <li
                    className="mb-1 text-sky-300"
                    key={`artifact-${artifact.id}-${el.id}`}
                >
                    {el.name}
                </li>
            )),
        ];
    };

    return (
        <div
            className={`flex flex-col p-2 rounded cursor-pointer hover:bg-electro-500 ${
                isOpen ? "bg-electro-600" : "bg-electro-850"
            }`}
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
                            loader={({ src }) => src}
                        />
                    ) : (
                        <></>
                    )}
                </div>
                <ArrowToggle isOpen={isOpen} strokeWidth={2} />
            </div>

            {isOpen ? (
                <div className={`w-full bg-inherit`}>
                    <p className="text-md">
                        <span className="pr-3 text-lg">Rarity</span>
                        {artifact.rarity.map((el) => (
                            <span
                                className="px-1"
                                key={artifact.id + "rarity" + el}
                            >{`${el} ${STAR_SYMBOL}`}</span>
                        ))}
                    </p>

                    <div>
                        {artifact.bonuses.length === 1 ? (
                            <div className="px-1">
                                <h3 className="text-lg">1pc Bonus</h3>
                                <p className="px-1">{artifact.bonuses[0]}</p>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-lg">2pc Bonus</h3>
                                <p className="px-1">{artifact.bonuses[0]}</p>
                                <h3 className="text-lg ">4pc Bonus</h3>
                                <p className="px-1">{artifact.bonuses[1]}</p>
                            </div>
                        )}
                    </div>

                    <p className="mt-2 text-lg">Obtained From</p>
                    <ul className="px-1">{artifactDropLocation()}</ul>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
