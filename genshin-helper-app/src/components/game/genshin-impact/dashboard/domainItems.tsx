import { GenshinDayDependentMaterial } from "@/types/apiResponses";
import dayjs from "dayjs";
import Image from "next/image";

function DomainItem(props: { item: GenshinDayDependentMaterial }) {
    const item = props.item;
    const name = props.item.value[0].name;

    return (
        <div
            className="flex flex-col items-center justify-between bg-electro-850 rounded p-2"
            title={name}
        >
            <h3 className="text-lg">{name}</h3>
            <h3 className="text-md italic">{item.domain.name}</h3>
            <div className="flex flex-row">
                {item.value.map((value) => {
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
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function DomainItems(props: {
    items: GenshinDayDependentMaterial[];
}) {
    const today = dayjs();

    const _items = props.items;
    const items = {
        books: _items.filter(
            (item) =>
                item.type === "book" && item.days.includes(String(today.day()))
        ),
        weapons: _items.filter(
            (item) =>
                item.type === "weaponMat" &&
                item.days.includes(String(today.day()))
        ),
    };

    return (
        <div className="w-full mx-auto p-4 my-8 rounded inline-block sm:flex sm:flex-col items-start justify-center font-exo">
            <h1 className="text-2xl">Today's Domains Drops</h1>
            <div className="flex flex-col w-full">
                <div className="w-full">
                    {/**put them into a flex row container with flex-wrap */}
                    <h2 className="text-left text-xl py-2">Books</h2>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-2">
                        {items.books.map((item) => {
                            return (
                                <DomainItem
                                    key={`book-${item.value[0].id}`}
                                    item={item}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <div className="w-full">
                        <h2 className="text-left text-xl py-2">
                            Weapon Materials
                        </h2>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-2">
                            {items.weapons.map((item) => {
                                return (
                                    <DomainItem
                                        key={`weaponMat-${item.value[0].id}`}
                                        item={item}
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
