"use client";
import LoadingLogo from "@/components/loadingLogo";
import { HTTP_METHOD } from "@/types";
import {
    GenshinCharacterBanner,
    GenshinEvent,
    GenshinGameEvent,
    GenshinWeaponBanner,
} from "@/types/genshinTypes";
import { findCurrentBanner, findCurrentEvents } from "@/utils/eventUtils";
import cmsRequest from "@/utils/fetchUtils";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import BannerItem from "./bannerItem";
import GameEvents from "./gameEvents";

export default function DashboardEvents() {
    const [items, setItems] = useState<{
        char: GenshinCharacterBanner | null;
        weapon: GenshinWeaponBanner | null;
        events: GenshinGameEvent[] | null;
    }>({
        char: null,
        weapon: null,
        events: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const req = await cmsRequest({
                    path: `/api/genshin-events/getEventOverview`,
                    method: HTTP_METHOD.GET,
                });
                const today = dayjs();
                const _items = await req.json();
                const char = findCurrentBanner(
                    _items,
                    "character",
                    today
                ) as GenshinCharacterBanner;
                const weapon = findCurrentBanner(
                    _items,
                    "weapon",
                    today
                ) as GenshinWeaponBanner;
                const events = findCurrentEvents(
                    _items,
                    today
                ) as GenshinGameEvent[];
                setItems({
                    char,
                    weapon,
                    events,
                });
                setLoading(false);
            } catch (error) {
                console.error("getDashboardEvents threw an error: ", error);
            }
        };
        fetchItems();
    }, []);

    return (
        <div className="w-full mx-auto p-4 my-8  bg-electro-800 rounded inline-block sm:flex sm:flex-col items-start justify-center font-exo">
            {loading ? (
                <div className="w-full flex items-center justify-center">
                    <LoadingLogo size="size-50" />
                </div>
            ) : (
                <>
                    <h1 className="w-full text-3xl py-2">Current Banners</h1>
                    <div className="w-full flex flex-col md:flex-row gap-4">
                        <BannerItem item={items.char} />
                        <BannerItem item={items.weapon} />
                    </div>
                    <h1 className="w-full text-3xl py-2">Current Events</h1>
                    <GameEvents events={items.events} />
                </>
            )}
        </div>
    );
}
