import ImageWithLoader from "@/components/imageWithLoader";
import { ExtraGenshinCharacter } from "@/types/genshinTypes";
import { GENSHIN_SUBSTAT_TEXT } from "@/utils/constants";
import { capitalizeString, getStarString } from "@/utils/utils";

export default function CharacterInfo(props: {
    character: ExtraGenshinCharacter;
}) {
    const { character } = props;

    return (
        <div
            className="flex flex-col mt-[-50vh] md:mt-0 items-center z-[1] md:block"
            style={{
                background:
                    "linear-gradient(180deg, rgba(77,63,88, 0) 0%, rgba(77,63,88,.75) 10%)",
            }}
        >
            <h1 className="text-5xl">{character.name}</h1>
            <div className="flex flex-row items-center mt-2">
                <span className="text-electro-5star-from text-2xl">
                    {getStarString(character.rarity)}
                </span>
                {character.element.icon ? (
                    <div className="relative size-10 mx-2">
                        <ImageWithLoader
                            alt={character.element.name}
                            src={character.element.icon}
                            fill={true}
                            sizes="100%"
                            className="object-scale-down"
                        />
                    </div>
                ) : (
                    character.element.name
                )}
            </div>
            <table className="w-[80%] my-2 border-b-2 border-electro-50/20">
                <tbody>
                    <tr>
                        <td className="text-electro-50 text-xl text-left w-1/2">
                            Birthday
                        </td>
                        <td className="text-electro-50 text-md">
                            {character.birthday}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-electro-50 text-xl text-left w-1/2">
                            Weapon Type
                        </td>
                        <td className="text-electro-50 text-md">
                            {capitalizeString(character.weaponType)}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-electro-50 text-xl text-left w-1/2">
                            Level Up Stat
                        </td>
                        <td className="text-electro-50 text-md">
                            {GENSHIN_SUBSTAT_TEXT[character.substat]}
                        </td>
                    </tr>
                </tbody>
            </table>

            <table className="w-[80%] my-2 border-b-2 border-electro-50/20">
                <caption className="text-electro-50 text-2xl text-left">
                    Character Level Up Materials
                </caption>
                <tbody>
                    <tr>
                        <td className="text-electro-50 text-xl text-left w-1/2">
                            Specialty
                        </td>
                        <td className="text-electro-50 text-md flex">
                            {character.specialty.icon ? (
                                <ImageWithLoader
                                    src={character.specialty.icon}
                                    alt={character.specialty.name}
                                    height={40}
                                    width={40}
                                    title={character.specialty.name}
                                />
                            ) : (
                                character.specialty.name
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-electro-50 text-xl text-left w-1/2">
                            Open World Boss
                        </td>
                        <td className="text-electro-50 text-md">
                            {character.boss && character.boss.icon ? (
                                <ImageWithLoader
                                    src={character.boss.icon}
                                    alt={character.boss.name}
                                    height={40}
                                    width={40}
                                    title={character.boss.name}
                                />
                            ) : (
                                // traveler does not need any boss drop
                                <></>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-electro-50 text-xl text-left w-1/2">
                            Gem
                        </td>
                        <td className="text-electro-50 text-md">
                            {character.gem.icon ? (
                                <ImageWithLoader
                                    src={character.gem.icon}
                                    alt={character.gem.name}
                                    height={40}
                                    width={40}
                                    title={character.gem.name}
                                />
                            ) : (
                                character.gem.name
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>

            <table className="w-[80%] my-2">
                <caption className="text-electro-50 text-2xl text-left">
                    Talent Lvl Up Materials
                </caption>
                <tbody>
                    <tr>
                        <td className="text-electro-50 text-xl text-left w-1/2">
                            Books
                        </td>
                        <td className="text-electro-50 text-md grid grid-cols-3 align-top">
                            {character.books.map((book, index) => {
                                return (
                                    <span
                                        key={book.name + index}
                                        title={book.name}
                                    >
                                        {book.icon ? (
                                            <ImageWithLoader
                                                src={book.icon}
                                                alt={book.name}
                                                height={40}
                                                width={40}
                                            />
                                        ) : (
                                            book.name
                                        )}
                                    </span>
                                );
                            })}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-electro-50 text-xl text-left w-1/2">
                            Weekly Boss
                        </td>
                        <td className="text-electro-50 text-md align-top">
                            {character.trounce.icon ? (
                                <ImageWithLoader
                                    src={character.trounce.icon}
                                    alt={character.trounce.name}
                                    height={40}
                                    width={40}
                                    title={character.trounce.name}
                                />
                            ) : (
                                character.trounce.name
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-electro-50 text-xl text-left w-1/2">
                            Mob Drop
                        </td>
                        <td className="text-electro-50 text-md align-top">
                            {character.talent.icon ? (
                                <ImageWithLoader
                                    src={character.talent.icon}
                                    alt={character.talent.name}
                                    height={40}
                                    width={40}
                                    title={character.talent.name}
                                />
                            ) : (
                                character.talent.name
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
