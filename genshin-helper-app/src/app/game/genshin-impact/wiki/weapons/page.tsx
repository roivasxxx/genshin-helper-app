import WeaponShowcase from "@/components/game/genshin-impact/weapons/weaponShowcase";
import { HTTP_METHOD } from "@/types";
import { GenshinWeapon } from "@/types/genshinTypes";
import cmsRequest from "@/utils/fetchUtils";
import { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "Weapons",
};

export default async function Weapons() {
    let weapons: GenshinWeapon[] = [];

    try {
        const result = await cmsRequest({
            path: "/api/genshin-weapons/getWeapons",
            method: HTTP_METHOD.GET,
        });
        weapons = await result.json();
    } catch (error) {
        return null;
    }

    return (
        <main className="w-full mt-[7rem] mx-auto p-4 my-8 bg-electro-800 rounded inline-block items-start justify-center font-exo lg:w-[75%] sm:flex">
            <div className="flex-1 flex inline-block flex-col justify-center">
                <WeaponShowcase weapons={weapons} />
            </div>
        </main>
    );
}
