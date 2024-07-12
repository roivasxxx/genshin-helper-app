"use client";
import ArrowToggle from "@/components/arrowToggle";
import { GenshinMaterial } from "@/types/genshinTypes";
import { WEEKDAYS } from "@/utils/dateUtils";
import { capitalizeString } from "@/utils/utils";
import Image from "next/image";
import { useState } from "react";

function ShowcaseItemRow(props: { item: GenshinMaterial["value"][number] }) {
    const item = props.item;
    return (
        <div className="flex flex-row items-center w-[85%] md:w-full">
            <div className="min-h-10 min-w-10">
                {item.icon ? (
                    <Image
                        src={item.icon}
                        alt={item.name}
                        height={60}
                        width={60}
                        sizes="100%"
                    />
                ) : (
                    <></>
                )}
            </div>
            <h3 className="text-lg">{item.name}</h3>
        </div>
    );
}

export default function MaterialShowcaseItem(props: {
    material: GenshinMaterial;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const material = props.material;
    const type = material.type;
    const values = material.value;
    const isMultiItem = values.length > 1;
    const isDayDependant =
        (type === "book" || type === "weaponMat") && "days" in material;
    const isDomainItem =
        type !== "specialty" && type !== "gem" && "domain" in material;

    const todayIndex = new Date().getDay();

    return (
        <div
            className={`p-2 bg-electro-850 w-full rounded relative w-full ${
                isMultiItem ? "cursor-pointer hover:bg-electro-700" : ""
            }`}
            {...(isMultiItem ? { onClick: () => setIsOpen(!isOpen) } : {})}
        >
            <ShowcaseItemRow item={values[0]} key={values[0].id} />

            {isMultiItem ? (
                <>
                    {values.length > 0 && isOpen ? (
                        values
                            .slice(1)
                            .map((value) => (
                                <ShowcaseItemRow
                                    item={value}
                                    key={`${value.id}`}
                                />
                            ))
                    ) : (
                        <></>
                    )}
                    <div className="flex flex-col w-full">
                        <div>
                            {isDayDependant ? (
                                <div className="flex flex-col md:flex-row text-md">
                                    <h4 className=" ">Available on</h4>
                                    <p>
                                        {material.days.map((day) => {
                                            const dayIndex =
                                                Number.parseInt(day);
                                            const isToday =
                                                dayIndex === todayIndex;
                                            return (
                                                <span
                                                    key={`${material.id}-day-${dayIndex}`}
                                                    className={`px-2 ${
                                                        isToday
                                                            ? "font-bold text-electro-5star-from"
                                                            : ""
                                                    }`}
                                                    {...(isToday
                                                        ? {
                                                              title: "Available Today",
                                                          }
                                                        : {})}
                                                >
                                                    {capitalizeString(
                                                        WEEKDAYS[dayIndex]
                                                    )}
                                                </span>
                                            );
                                        })}
                                    </p>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        {isDomainItem ? (
                            <div className="flex flex-col md:flex-row text-md">
                                <h4 className="md:pr-2">Domain</h4>
                                <span className="font-bold">
                                    {material.domain.name}
                                </span>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="absolute top-[50%] translate-y-[-50%] right-5">
                        <ArrowToggle isOpen={isOpen} strokeWidth={4} />
                    </div>
                </>
            ) : (
                <> </>
            )}
        </div>
    );
}
