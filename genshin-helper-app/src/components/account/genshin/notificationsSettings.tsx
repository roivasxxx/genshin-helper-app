"use client";
import { useEffect, useState } from "react";
import { GenshinAccountState, useAccount } from "../accountProvider";
import cmsRequest from "@/utils/fetchUtils";
import { HTTP_METHOD } from "@/types";
import dayjs from "dayjs";
import NotificationSwitch from "./notificationSwitch";
import LoadingLogo from "@/components/loadingLogo";
import SuccessCheckmark from "@/components/successCheckmark";
import { GenshinDayDependentMaterial } from "@/types/genshinTypes";
import Image from "next/image";
import { SHORT_DAYS } from "@/utils/dateUtils";

export default function GenshinNotificationSettings() {
    const { state, setNotificationSettings, saveNotificationSettings } =
        useAccount();

    const notificationsState = state.games.genshin.notifications;

    const [status, setStatus] = useState("loading");

    const [domainItems, setDomainItems] = useState<{
        books: GenshinDayDependentMaterial[];
        weapons: GenshinDayDependentMaterial[];
    }>({ books: [], weapons: [] });

    const now = dayjs();

    useEffect(() => {
        let abortController = new AbortController();
        const getDomainItems = async () => {
            try {
                const result = await cmsRequest({
                    path: "/api/genshin-items/getDomainItems",
                    method: HTTP_METHOD.GET,
                    abortController,
                });
                const _domainItems = await result.json();

                setDomainItems({
                    books: _domainItems.books.flat(),
                    weapons: _domainItems.weapons.flat(),
                });
            } catch (error) {
                console.error("getDomainItems threw an error: ", error);
            }
            setStatus("");
        };
        getDomainItems();
        return () => {
            if (!abortController.signal.aborted) {
                abortController.abort();
            }
        };
    }, []);

    const notificationChangeHandler = async <
        T extends keyof GenshinAccountState["notifications"]
    >(
        key: T,
        value: GenshinAccountState["notifications"][T]
    ) => {
        if (!setNotificationSettings) return;
        setStatus("");
        await setNotificationSettings(key, value);
    };

    const itemHandler = (value: string) => {
        notificationChangeHandler(
            "items",
            notificationsState.items.includes(value)
                ? notificationsState.items.filter((el) => el !== value)
                : [...notificationsState.items, value]
        );
    };

    const save = async () => {
        if (!saveNotificationSettings) return;
        setStatus("saving");
        const result = await saveNotificationSettings();
        setStatus(result ? "success" : "error");
    };

    return (
        <>
            <div>
                <h1 className="text-3xl text-wrap break-words ">
                    Your Genshin Impact Notification Settings
                </h1>
                {state.loading || status === "loading" ? (
                    <div className="w-full h-full flex justify-center items-center">
                        <LoadingLogo size="size-40" />;
                    </div>
                ) : (
                    <>
                        <div className="w-full flex justify-end items-center">
                            <div className="flex items-center">
                                <div className="px-2">
                                    {status === "saving" ? (
                                        <LoadingLogo size="size-10" />
                                    ) : (
                                        <></>
                                    )}
                                    {status === "success" ? (
                                        <div title="Notifications saved">
                                            <SuccessCheckmark className="size-10 stroke-green-500" />
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                    {status === "error" ? (
                                        <div
                                            title="Notifications not saved"
                                            className="relative"
                                        >
                                            <span className="animate-scale-up p-2 before:absolute before:border-red-500 before:border-b-2 before:w-6 before:left-0 before:top-[50%] before:rotate-45 after:absolute after:border-red-500 after:border-b-2 after:w-6 after:left-0 after:top-[50%] after:rotate-[-45deg]" />
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                            <button
                                className="bg-electro-700 p-4 text-lg font-bold rounded hover:bg-electro-900 disabled:bg-electro-900 disabled:cursor-not-allowed"
                                disabled={status === "loading"}
                                onClick={save}
                            >
                                Save
                            </button>
                        </div>
                        <div>
                            <h2 className="text-2xl">Daily Domain Drops</h2>
                            <div className="grid grid-cols-1 gap-2">
                                <div>
                                    <h3 className="text-xl">Books</h3>
                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                                        {domainItems.books.map((book) => {
                                            const value = book.value[0];
                                            return (
                                                <button
                                                    className={`flex flex-col p-2 items-center cursor-pointer hover:bg-electro-700 text-center ${
                                                        notificationsState.items.includes(
                                                            book.id
                                                        )
                                                            ? "bg-electro-700"
                                                            : "bg-electro-850"
                                                    } rounded`}
                                                    key={book.id}
                                                    onClick={() =>
                                                        itemHandler(book.id)
                                                    }
                                                >
                                                    {value.icon ? (
                                                        <Image
                                                            src={value.icon}
                                                            sizes="100%"
                                                            alt={value.name}
                                                            width={0}
                                                            height={0}
                                                            className="w-10 h-10"
                                                        />
                                                    ) : (
                                                        <></>
                                                    )}
                                                    <span>
                                                        {book.days.map(
                                                            (day) => (
                                                                <span
                                                                    className={`px-1 text-sm ${
                                                                        now.day() ===
                                                                        Number(
                                                                            day
                                                                        )
                                                                            ? "text-electro-5star-from/80"
                                                                            : "text-inherit"
                                                                    }`}
                                                                    key={`${book.id}-${day}`}
                                                                >
                                                                    {
                                                                        SHORT_DAYS[
                                                                            Number(
                                                                                day
                                                                            )
                                                                        ]
                                                                    }
                                                                </span>
                                                            )
                                                        )}
                                                    </span>
                                                    {value.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl">Weapons</h3>
                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                                        {domainItems.weapons.map((weapon) => {
                                            const value = weapon.value[0];
                                            return (
                                                <button
                                                    className={`flex flex-col p-2 items-center cursor-pointer hover:bg-electro-700 text-center ${
                                                        notificationsState.items.includes(
                                                            weapon.id
                                                        )
                                                            ? "bg-electro-700"
                                                            : "bg-electro-850"
                                                    } rounded`}
                                                    key={weapon.id}
                                                    onClick={() =>
                                                        itemHandler(weapon.id)
                                                    }
                                                >
                                                    {value.icon ? (
                                                        <Image
                                                            src={value.icon}
                                                            sizes="100%"
                                                            alt={value.name}
                                                            width={0}
                                                            height={0}
                                                            className="w-10 h-10"
                                                        />
                                                    ) : (
                                                        <></>
                                                    )}
                                                    <span>
                                                        {weapon.days.map(
                                                            (day) => (
                                                                <span
                                                                    className={`px-1 text-sm ${
                                                                        now.day() ===
                                                                        Number(
                                                                            day
                                                                        )
                                                                            ? "text-electro-5star-from/80"
                                                                            : "text-inherit"
                                                                    }`}
                                                                    key={`${weapon.id}-${day}`}
                                                                >
                                                                    {
                                                                        SHORT_DAYS[
                                                                            Number(
                                                                                day
                                                                            )
                                                                        ]
                                                                    }
                                                                </span>
                                                            )
                                                        )}
                                                    </span>
                                                    {value.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
