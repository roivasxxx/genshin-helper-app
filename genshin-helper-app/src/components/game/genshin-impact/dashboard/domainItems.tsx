"use client";
import { GenshinDayDependentMaterial } from "@/types/genshinTypes";
import dayjs from "dayjs";
import Image from "next/image";

function DomainItemWrapper(props: { items: GenshinDayDependentMaterial[] }) {
    const items = props.items;

    const domain = items[0].domain;

    return (
        <div className="flex flex-col gap-2 bg-electro-850 rounded p-2">
            <h2 className="text-lg italic text-nowrap">{domain.name}</h2>
            {items.map((itemsArray) => (
                <div key={"domainItem-" + itemsArray.id}>
                    <h3 className="text-md text-nowrap">
                        {itemsArray.value[0].name}
                    </h3>
                    <div className="flex flex-row">
                        {itemsArray.value.map((value) => {
                            return (
                                <div
                                    className="h-10 w-10 lg:w-12 lg:h-12"
                                    key={`value-${value.id}`}
                                >
                                    {value.icon ? (
                                        <Image
                                            src={value.icon}
                                            alt={value.name}
                                            height={0}
                                            width={0}
                                            sizes="100%"
                                            className="w-full h-full"
                                            loader={({ src }) => src}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function DomainItems(props: {
    items: {
        books: GenshinDayDependentMaterial[][];
        weapons: GenshinDayDependentMaterial[][];
    };
}) {
    const today = dayjs();
    const _items = props.items;

    const items = {
        books: _items.books.map((items) =>
            items.filter(
                (item) =>
                    item.type === "book" &&
                    item.days.includes(String(today.day()))
            )
        ),
        weapons: _items.weapons.map((items) =>
            items.filter(
                (item) =>
                    item.type === "weaponMat" &&
                    item.days.includes(String(today.day()))
            )
        ),
    };

    return (
        <div className="w-full flex flex-col p-4 my-8  bg-electro-800 rounded sm:flex sm:flex-col items-start justify-center font-exo">
            <h1 className="text-3xl">Farmable today</h1>
            <div className="flex flex-col w-full ">
                <div className="w-full">
                    <h2 className="text-left text-xl py-2">Books</h2>
                    <div className="flex flex-col gap-4 md:flex-row w-full overflow-x-auto p-2">
                        {items.books.map((items) => {
                            return (
                                <DomainItemWrapper
                                    key={`book-${items[0].value[0].id}`}
                                    items={items}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="flex w-full">
                    <div className="w-full">
                        <h2 className="text-left text-xl py-2">
                            Weapon Materials
                        </h2>
                        <div className="flex flex-col gap-4 md:flex-row w-full overflow-x-auto justify-between p-2">
                            {items.weapons.map((items) => {
                                return (
                                    <DomainItemWrapper
                                        key={`weaponMat-${items[0].value[0].id}`}
                                        items={items}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
