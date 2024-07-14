import { FIFTY_FIFTY_STATUS, ItemWithPity } from "@/types/genshinTypes";
import { BANNER_TYPE, STAR_SYMBOL, STEP_SYMBOL } from "@/utils/constants";

export default function ItemStats(props: {
    bannerType: BANNER_TYPE;
    fourStar: ItemWithPity[];
    fiveStar: ItemWithPity[];
    total: number;
}) {
    const { bannerType, fourStar, fiveStar, total } = props;

    const numberFormat = Intl.NumberFormat("en", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
    });

    const isNotStandard = bannerType !== BANNER_TYPE.STANDARD;

    // 4 star
    const fourStarTotal = fourStar.length;
    const fourStarCharacters = fourStar.filter(
        (el) => el.type === BANNER_TYPE.CHARACTER
    );
    const fourStarWeapons = fourStar.filter(
        (el) => el.type === BANNER_TYPE.WEAPON
    );
    const fourStarPity = fourStar.reduce(
        (acc, item) => {
            if (item.fiftyFiftyStatus === FIFTY_FIFTY_STATUS.WON) {
                return { ...acc, won: acc.won + 1 };
            } else if (item.fiftyFiftyStatus === FIFTY_FIFTY_STATUS.LOST) {
                return { ...acc, lost: acc.lost + 1 };
            }
            return acc;
        },
        { won: 0, lost: 0 }
    );
    const fourStarPityPercentage =
        (fourStarPity.won / (fourStarPity.won + fourStarPity.lost || 1)) * 100;

    const fourStarPercentage = (fourStarTotal / (total || 1)) * 100;
    const fourStarCharacterPercentage =
        (fourStarCharacters.length / (total || 1)) * 100;
    const fourStarWeaponPercentage =
        (fourStarWeapons.length / (total || 1)) * 100;

    const fourStarPityAverage = fourStar.reduce(
        (acc, item) => {
            return {
                all: acc.all + item.pity,
                character:
                    acc.character +
                    (item.type === BANNER_TYPE.CHARACTER ? item.pity : 0),
                weapon:
                    acc.weapon +
                    (item.type === BANNER_TYPE.WEAPON ? item.pity : 0),
            };
        },
        { all: 0, character: 0, weapon: 0 }
    );
    const fourStarPityAverageAll =
        fourStarPityAverage.all / (fourStarTotal || 1);
    const fourStarPityAverageCharacter =
        fourStarPityAverage.character / (fourStarCharacters.length || 1);
    const fourStarPityAverageWeapon =
        fourStarPityAverage.weapon / (fourStarWeapons.length || 1);

    // 5 star
    const fiveStarTotal = fiveStar.length;

    const fiveStarPity = fiveStar.reduce(
        (acc, item) => {
            if (item.fiftyFiftyStatus === FIFTY_FIFTY_STATUS.WON) {
                return { ...acc, won: acc.won + 1 };
            } else if (item.fiftyFiftyStatus === FIFTY_FIFTY_STATUS.LOST) {
                return { ...acc, lost: acc.lost + 1 };
            }
            return acc;
        },
        { won: 0, lost: 0 }
    );
    // dont count guaranteed
    const fiveStarPityPercentage =
        (fiveStarPity.won / (fiveStarPity.won + fiveStarPity.lost || 1)) * 100;
    const fiveStarPercentage = (fiveStarTotal / (total || 1)) * 100;
    const fiveStarPityAverage =
        fiveStar.reduce((acc, item) => {
            return acc + item.pity;
        }, 0) / (fiveStarTotal || 1);

    return (
        <div>
            <div className="flex-1 bg-electro-900 rounded p-2">
                <h2 className="text-xl font-bold">{`4/5${STAR_SYMBOL} Stats`}</h2>
                <table className="w-full text-right">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Total</th>
                            <th>Percent</th>
                            <th>Pity AVG</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="text-electro-5star-from border-t border-electro-50/20">
                            <td className="text-left">{`5 ${STAR_SYMBOL}`}</td>
                            <td>{fiveStarTotal}</td>
                            <td>{numberFormat.format(fiveStarPercentage)} %</td>
                            <td>{numberFormat.format(fiveStarPityAverage)}</td>
                        </tr>
                        {isNotStandard ? (
                            <tr className="text-electro-5star-from border-t border-electro-50/20">
                                <td className="text-left pl-4">{`${STEP_SYMBOL} Win 50/50`}</td>
                                <td>{fiveStarPity.won}</td>
                                <td>
                                    {numberFormat.format(
                                        fiveStarPityPercentage
                                    )}
                                    %
                                </td>
                                <td></td>
                            </tr>
                        ) : (
                            <></>
                        )}
                        <tr className="text-electro-4star-from border-t border-electro-50/20">
                            <td className="text-left">{`4 ${STAR_SYMBOL}`}</td>
                            <td>{fourStarTotal}</td>
                            <td>{numberFormat.format(fourStarPercentage)} %</td>
                            <td>
                                {numberFormat.format(fourStarPityAverageAll)}
                            </td>
                        </tr>
                        <tr className="text-electro-4star-from border-t border-electro-50/20">
                            <td className="text-left pl-4">{`${STEP_SYMBOL} Characters`}</td>
                            <td>{fourStarCharacters.length}</td>
                            <td>
                                {numberFormat.format(
                                    fourStarCharacterPercentage
                                )}{" "}
                                %
                            </td>
                            <td>
                                {numberFormat.format(
                                    fourStarPityAverageCharacter
                                )}
                            </td>
                        </tr>
                        <tr className="text-electro-4star-from border-t border-electro-50/20">
                            <td className="text-left pl-4">{`${STEP_SYMBOL} Weapons`}</td>
                            <td>{fourStarWeapons.length}</td>
                            <td>
                                {numberFormat.format(fourStarWeaponPercentage)}{" "}
                                %
                            </td>
                            <td>
                                {numberFormat.format(fourStarPityAverageWeapon)}
                            </td>
                        </tr>
                        {isNotStandard ? (
                            <tr className="text-electro-4star-from border-t border-electro-50/20">
                                <td className="text-left pl-4">{`${STEP_SYMBOL} Win 50/50`}</td>
                                <td>{fourStarPity.won}</td>
                                <td>
                                    {numberFormat.format(
                                        fourStarPityPercentage
                                    )}
                                    %
                                </td>
                                <td></td>
                            </tr>
                        ) : (
                            <></>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
