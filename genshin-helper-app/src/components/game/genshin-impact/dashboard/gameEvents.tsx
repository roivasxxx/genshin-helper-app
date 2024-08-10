import { GenshinGameEvent } from "@/types/genshinTypes";
import { DATE_TIME_FORMAT, formatEventDate } from "@/utils/dateUtils";
import Image from "next/image";

export default function GameEvents(props: {
    events: GenshinGameEvent[] | null;
}) {
    const events = props.events || [];

    return (
        <div className="flex flex-col md:flex-row justify-start gap-4 w-full md:overflow-x-auto">
            {events.map((el) => (
                <div
                    key={"event-" + el.name}
                    className="h-full bg-electro-850 rounded p-2 flex flex-col items-center justify-between w-auto"
                >
                    <div className="w-full flex-1 flex flex-col items-center">
                        <h2 className="text-2xl py-2 md:text-nowrap text-center">
                            {el.name}
                        </h2>
                        <div className="flex flex-col w-full md:flex-row justify-center  text-lg">
                            <span className="text-center text-nowrap">
                                {formatEventDate(
                                    el.start,
                                    el.timezoneDependent,
                                    DATE_TIME_FORMAT
                                )}
                            </span>
                            <span className="text-center px-2">-</span>
                            <span className="text-center text-nowrap">
                                {formatEventDate(
                                    el.end,
                                    el.timezoneDependent,
                                    DATE_TIME_FORMAT
                                )}
                            </span>
                        </div>
                    </div>

                    <a
                        className="p-5 overflow-hidden w-[300px] h-[150px] flex items-center justify-center"
                        {...(el.url ? { href: el.url } : {})}
                    >
                        {el.icon ? (
                            <Image
                                src={el.icon}
                                alt={el.name}
                                width={300}
                                height={150}
                                className="h-full h-full rounded object-fill"
                                sizes="100%"
                                loader={({ src }) => src}
                            />
                        ) : (
                            <></>
                        )}
                    </a>
                </div>
            ))}
        </div>
    );
}
