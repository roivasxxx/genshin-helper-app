"use client";
import {
    GenshinMaterialType,
    GenshinMaterial,
    GenshinMaterialLabel,
} from "@/types/genshinTypes";
import MaterialShowcaseSection from "./materialShowcaseSection";
import { useMemo, useState } from "react";
import Image from "next/image";

function MaterialTypeItem(props: {
    type: GenshinMaterialType;
    onClick: () => void;
    selectedType: GenshinMaterialType;
}) {
    return (
        <button
            className={`w-full flex justify-center cursor-pointer rounded bg-electro-850 hover:bg-electro-700 ${
                props.selectedType === props.type ? "bg-electro-700" : ""
            }`}
            title={GenshinMaterialLabel[props.type]}
            onClick={props.onClick}
        >
            <Image
                src={`/images/games/icons/genshin-impact/material-types/${props.type}.png`}
                width={60}
                height={60}
                alt={GenshinMaterialLabel[props.type]}
                sizes="100%"
            />
        </button>
    );
}

export default function MaterialShowcase(props: {
    materials: GenshinMaterial[];
}) {
    const [selectedKey, setSelectedKey] =
        useState<GenshinMaterialType>("weaponMat");

    const memodSections = useMemo(() => {
        const sections: { [K in GenshinMaterialType]: GenshinMaterial[] } = {
            weaponMat: [],
            book: [],
            bossDrop: [],
            mobDrop: [],
            gem: [],
            specialty: [],
            trounceDrop: [],
        };
        props.materials.forEach((material) => {
            sections[material.type].push(material);
        });
        return sections;
    }, []);

    return (
        <>
            <div className="bg-electro-800 p-4 rounded mb-4">
                <div className="grid grid-cols-7 gap-2 justify-center p-2">
                    <MaterialTypeItem
                        type="weaponMat"
                        onClick={() => setSelectedKey("weaponMat")}
                        selectedType={selectedKey}
                    />
                    <MaterialTypeItem
                        type="book"
                        onClick={() => setSelectedKey("book")}
                        selectedType={selectedKey}
                    />
                    <MaterialTypeItem
                        type="mobDrop"
                        onClick={() => setSelectedKey("mobDrop")}
                        selectedType={selectedKey}
                    />
                    <MaterialTypeItem
                        type="bossDrop"
                        onClick={() => setSelectedKey("bossDrop")}
                        selectedType={selectedKey}
                    />
                    <MaterialTypeItem
                        type="specialty"
                        onClick={() => setSelectedKey("specialty")}
                        selectedType={selectedKey}
                    />
                    <MaterialTypeItem
                        type="trounceDrop"
                        onClick={() => setSelectedKey("trounceDrop")}
                        selectedType={selectedKey}
                    />
                    <MaterialTypeItem
                        type="gem"
                        onClick={() => setSelectedKey("gem")}
                        selectedType={selectedKey}
                    />
                </div>
                <MaterialShowcaseSection
                    materialType={selectedKey}
                    materials={memodSections[selectedKey]}
                />
            </div>
        </>
    );
}
