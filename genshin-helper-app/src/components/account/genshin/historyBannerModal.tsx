import BannerItemPreview from "@/components/game/genshin-impact/bannerItemPreview";
import LoadingLogo from "@/components/loadingLogo";
import { HTTP_METHOD } from "@/types";
import { ItemWithPity, NameIconWithIdDictionary } from "@/types/genshinTypes";
import {
    BANNER_TYPE,
    PRIMOS_PER_WISH,
    STAR_SYMBOL,
    STEP_SYMBOL,
} from "@/utils/constants";
import { DATE_TIME_FORMAT, formatEventDate } from "@/utils/dateUtils";
import cmsRequest from "@/utils/fetchUtils";
import { getFiftyFiftyColor } from "@/utils/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

type BannerInfo = {
    pulls: number;
    fourStar: ItemWithPity[];
    fiveStar: ItemWithPity[];
};

type HistoryBannerData = {
    start: string;
    end: string;
    timezoneDependent: boolean;
    bannerType: BANNER_TYPE;
    fiveStar1: NameIconWithIdDictionary;
    fiveStar2: NameIconWithIdDictionary | null;
    fourStar: NameIconWithIdDictionary[];
    userData: BannerInfo;
};

function WishItem(props: ItemWithPity) {
    const { pity, name, fiftyFiftyStatus } = props;

    const fiftyFiftyStatusColor = getFiftyFiftyColor(fiftyFiftyStatus);
    return (
        <div className="rounded-full px-2 py-1 border-2 border-electro-5star-from flex flex-row items-center justify-between gap-2 text-xl">
            <span className="whitespace-nowrap">{name}</span>
            <span className={fiftyFiftyStatusColor}>{pity}</span>
        </div>
    );
}

function UserPullInfo(props: BannerInfo) {
    const { pulls, fourStar, fiveStar } = props;

    const fiveStarPercentage = (fiveStar.length / pulls) * 100;
    const fourStarPercentage = (fourStar.length / pulls) * 100;

    const fiveStarPity =
        fiveStar.length === 0
            ? 0
            : fiveStar.reduce((acc, item) => {
                  return acc + item.pity;
              }, 0) / fiveStar.length;

    const fourStarPity =
        fourStar.length === 0
            ? 0
            : fourStar.reduce((acc, item) => {
                  return acc + item.pity;
              }, 0) / fourStar.length;

    const fourStarCharacters = fourStar.filter(
        (el) => el.type === BANNER_TYPE.CHARACTER
    );
    const fourStarWeapons = fourStar.filter(
        (el) => el.type === BANNER_TYPE.WEAPON
    );

    const fourStarCharacterPercentage =
        (fourStarCharacters.length / pulls) * 100;
    const fourStarWeaponPercentage = (fourStarWeapons.length / pulls) * 100;

    const fourStarPityCharacters =
        fourStarCharacters.length === 0
            ? 0
            : fourStarCharacters.reduce((acc, item) => {
                  if (item.type === BANNER_TYPE.CHARACTER) {
                      return acc + item.pity;
                  }
                  return acc;
              }, 0) / fourStarCharacters.length;

    const fourStarPityWeapons =
        fourStarWeapons.length === 0
            ? 0
            : fourStarWeapons.reduce((acc, item) => {
                  if (item.type === BANNER_TYPE.WEAPON) {
                      return acc + item.pity;
                  }
                  return acc;
              }, 0) / fourStarWeapons.length;

    return (
        <>
            <h2 className="text-xl my-2">Your pulls</h2>
            {/** divide 4stars into weapons/characters, add border */}
            <table className="text-xl text-left border-0">
                <thead>
                    <tr>
                        <th className="pr-5">Rarity</th>
                        <th className="pr-2">Total</th>
                        <th className="pr-2">Percent</th>
                        <th className="pr-2">Pity AVG</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="text-electro-5star-from border-t border-electro-50/20">
                        <td className="pr-5">{`5 ${STAR_SYMBOL}`}</td>
                        <td className="pr-2">{fiveStar.length}</td>
                        <td className="pr-2">{`${fiveStarPercentage.toFixed(
                            2
                        )} %`}</td>
                        <td className="pr-2">{fiveStarPity.toFixed(2)}</td>
                    </tr>
                    <tr className="text-electro-4star-from border-t border-electro-50/20">
                        <td className="pr-5">{`4 ${STAR_SYMBOL}`}</td>
                        <td className="pr-2">{fourStar.length}</td>
                        <td className="pr-2">{`${fourStarPercentage.toFixed(
                            2
                        )} %`}</td>
                        <td className="pr-2">{fourStarPity.toFixed(2)}</td>
                    </tr>

                    <tr className="text-electro-4star-from border-t border-electro-50/20">
                        <td className="pl-2 pr-5">{`${STEP_SYMBOL} Characters`}</td>
                        <td className="pr-2">{fourStarCharacters.length}</td>
                        <td className="pr-2">{`${fourStarCharacterPercentage.toFixed(
                            2
                        )} %`}</td>
                        <td className="pr-2">
                            {fourStarPityCharacters.toFixed(2)}
                        </td>
                    </tr>

                    <tr className="text-electro-4star-from border-t border-electro-50/20">
                        <td className="pl-2 pr-5">{`${STEP_SYMBOL} Weapons`}</td>
                        <td className="pr-2">{fourStarWeapons.length}</td>
                        <td className="pr-2">{`${fourStarWeaponPercentage.toFixed(
                            2
                        )} %`}</td>
                        <td className="pr-2">
                            {fourStarPityWeapons.toFixed(2)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}

export default function HistoryBannerModal(props: {
    bannerId: string;
    accountId: string;
}) {
    const { bannerId, accountId } = props;
    const [state, setState] = useState<{
        loading: boolean;
        data: HistoryBannerData | null;
        error: string;
    }>({
        loading: true,
        data: null,
        error: "",
    });

    useEffect(() => {
        const abortController = new AbortController();
        const getData = async () => {
            try {
                const req = await cmsRequest({
                    method: HTTP_METHOD.GET,
                    path: `/api/genshin-accounts/getBannerOverview?accountId=${accountId}&bannerId=${bannerId}`,
                    abortController,
                });
                const data = await req.json();

                setState((state) => {
                    return {
                        ...state,
                        loading: false,
                        error: "",
                        data,
                    };
                });
            } catch (error) {
                setState((state) => {
                    return {
                        ...state,
                        loading: false,
                        error: "Failed to fetch banner data :(",
                    };
                });
            }
        };

        getData();

        return () => {
            if (abortController) {
                abortController.abort();
            }
        };
    }, []);

    if (state.error) {
        return <p>{state.error}</p>;
    }

    if (state.loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <LoadingLogo size="size-40" />
            </div>
        );
    }

    if (state.data) {
        return (
            <div className="w-full h-full">
                <div className="flex p flex-col items-center bg-electro-850 rounded p-4 flex-1 overflow-auto">
                    <h2 className="text-2xl py-2">
                        {state.data.bannerType === BANNER_TYPE.WEAPON
                            ? "Weapon"
                            : "Character"}{" "}
                        Banner
                    </h2>
                    <div className="flex flex-col w-full items-center">
                        <div className="flex flex-col w-full md:flex-row items-center justify-center text-sm md:text-lg mb-2">
                            <span className="text-center text-nowrap">
                                {formatEventDate(
                                    state.data.start,
                                    state.data.timezoneDependent,
                                    DATE_TIME_FORMAT
                                )}
                            </span>
                            <span className="text-center px-2">-</span>
                            <span className="text-center text-nowrap">
                                {formatEventDate(
                                    state.data.end,
                                    state.data.timezoneDependent,
                                    DATE_TIME_FORMAT
                                )}
                            </span>
                        </div>
                        <div className="flex flex-row w-[90%] gap-2 justify-between md:w-full overflow-auto h-44">
                            <BannerItemPreview
                                item={state.data.fiveStar1}
                                rarity={5}
                            />
                            {state.data.fiveStar2 ? (
                                <BannerItemPreview
                                    item={state.data.fiveStar2}
                                    rarity={5}
                                />
                            ) : (
                                <></>
                            )}
                            {state.data.fourStar.map((item) => (
                                <BannerItemPreview
                                    key={"bannerDialog-" + item.name}
                                    item={item}
                                    rarity={4}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="text-xl flex flex-col md:flex-row">
                    <span className="pr-1">Total pulls this banner</span>
                    <span className="text-electro-5star-from">
                        {state.data.userData.pulls}{" "}
                    </span>
                    <div className="text-xl flex flex-row">
                        <span className="pl-1">
                            {`(${state.data.userData.pulls * PRIMOS_PER_WISH}`}
                        </span>
                        <Image
                            src="/images/primogem.png"
                            alt="primogem"
                            width={24}
                            height={16}
                            sizes="100%"
                            className="ml-2 object-contain"
                        />
                        <span>{")"}</span>
                    </div>
                </div>

                <UserPullInfo {...state.data.userData} />

                <div className="flex flex-row w-[90%] gap-2 md:w-full overflow-auto my-2 py-2">
                    {state.data.userData.fiveStar.length > 0 ? (
                        state.data.userData.fiveStar.map((item, index) => (
                            <WishItem
                                key={bannerId + item.name + index}
                                {...item}
                            />
                        ))
                    ) : (
                        <span>{"No fivestars"}</span>
                    )}
                </div>
            </div>
        );
    }

    return <></>;
}
