import { ExtraGenshinCharacter } from "@/types/genshinTypes";
import BannerCharacterPreview from "./bannerCharacterPreview";
import { formatEventDuration } from "@/utils/dateUtils";

export default function CharacterBanners(props: {
    character: ExtraGenshinCharacter;
}) {
    const { character } = props;

    return (
        <div className="bg-electro-800 rounded p-4 my-8">
            <table className="w-full my-2 border-separate border-spacing-y-2 p-2 rounded">
                <caption className="text-electro-50 text-2xl text-left font-bold">
                    Banners
                </caption>
                <thead>
                    <tr>
                        <th className="text-electro-50 text-left text-lg border-b-2 border-electro-50/20">
                            Characters
                        </th>
                        <th className="text-electro-50 text-left text-lg border-b-2 border-electro-50/20">
                            Duration
                        </th>
                        <th className="text-electro-50 text-left text-lg border-b-2 border-electro-50/20">
                            Version
                        </th>
                    </tr>
                </thead>
                <tbody className="gap-2">
                    {character.events.map((event) => {
                        const { fiveStar1, fiveStar2 } = event.characters;
                        return (
                            <tr
                                key={event.id}
                                className="border-b-2 border-electro-50 text-sm md:text-md "
                            >
                                <td className="flex flex-row flex-wrap gap-2 border-b-2 border-electro-50/20 align-top">
                                    <BannerCharacterPreview
                                        char={fiveStar1}
                                        rarity={5}
                                        href={`/game/genshin-impact/wiki/characters/${fiveStar1.id}`}
                                    />
                                    {fiveStar2 ? (
                                        <BannerCharacterPreview
                                            char={fiveStar2}
                                            rarity={5}
                                            href={`/game/genshin-impact/wiki/characters/${fiveStar2.id}`}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                    {event.characters.fourStar.map(
                                        (fourStar) => {
                                            return (
                                                <BannerCharacterPreview
                                                    char={fourStar}
                                                    rarity={4}
                                                    href={`/game/genshin-impact/wiki/characters/${fourStar.id}`}
                                                    key={`${event.id}-${fourStar.id}`}
                                                />
                                            );
                                        }
                                    )}
                                </td>
                                <td className="border-b-2 border-electro-50/20 align-top">
                                    {formatEventDuration(
                                        event.start,
                                        event.end
                                    )}
                                </td>
                                <td className="border-b-2 border-electro-50/20 align-top">
                                    {event.version}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
