import { GenshinGameEvent } from "@/types/apiResponses";
import { DATE_TIME_FORMAT, formatEventDate } from "@/utils/dateUtils";
import Image from "next/image";

export default function GameEvents(props: {
    events: GenshinGameEvent[] | null;
}) {
    const events = props.events || [];

    return (
        <div className="w-full h-full grid grid-cols-[repeat(auto-fit,_minmax(200px,1fr))] gap-4">
            {events.map((el) => (
                <div
                    key={"event-" + el.name}
                    className="h-full bg-electro-850 rounded p-2 flex flex-col items-center"
                >
                    <h2 className="text-2xl py-2">{el.name}</h2>
                    <div className="flex flex-col w-full md:flex-row justify-center  text-lg">
                        <span className="text-center">
                            {formatEventDate(
                                el.start,
                                el.timezoneDependent,
                                DATE_TIME_FORMAT
                            )}
                        </span>
                        <span className="text-center px-2">-</span>
                        <span className="text-center">
                            {formatEventDate(
                                el.end,
                                el.timezoneDependent,
                                DATE_TIME_FORMAT
                            )}
                        </span>
                    </div>
                    <div className="p-5 overflow-hidden">
                        {el.icon ? (
                            <Image
                                src={el.icon}
                                alt={el.name}
                                width={0}
                                height={0}
                                className="h-full w-full rounded"
                                sizes="100%"
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
