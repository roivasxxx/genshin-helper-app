import WeaponInfo from "@/components/game/genshin-impact/weapons/weaponPage/weaponInfo";
import ImageWithLoader from "@/components/imageWithLoader";
import { HTTP_METHOD } from "@/types";
import { GenshinWeapon } from "@/types/genshinTypes";
import cmsRequest from "@/utils/fetchUtils";
import { Metadata, ResolvingMetadata } from "next";

export async function generateStaticParams() {
    let weapons = [];
    try {
        const result = await cmsRequest({
            path: "/api/genshin-weapons/getWeapons",
            method: HTTP_METHOD.GET,
        });
        weapons = await result.json();
    } catch (error) {
        console.error(
            "WeaponSlug - generateStaticParams threw an error",
            error
        );
    }
    return weapons.map((el: any) => {
        return { weaponId: el.id };
    });
}

type Props = {
    params: { weaponId: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.weaponId;
    let title = "Weapon";
    try {
        const data = await cmsRequest({
            path: `/api/genshin-weapons/getWeaponName?id=${id}&skipRateLimitKey=${process.env.SKIP_RATE_LIMIT_KEY}`,
            method: HTTP_METHOD.GET,
        });
        title = await data.text();
    } catch (error) {
        console.error("WeaponSlug - generateMetadata threw an error", error);
    }
    return {
        title: title,
    };
}

export default async function WeaponSlug(props: {
    params: {
        weaponId: string;
    };
}) {
    const { weaponId } = props.params;
    let weapon: GenshinWeapon;
    try {
        const result = await cmsRequest({
            path: `/api/genshin-weapons/getWeapon?id=${weaponId}&skipRateLimitKey=${process.env.SKIP_RATE_LIMIT_KEY}`,
            method: HTTP_METHOD.GET,
        });
        weapon = await result.json();
    } catch (error) {
        console.error("WeaponSlug - threw an error", error);
        return null;
    }

    return (
        <main className="w-full mt-[7rem] mx-auto  inline-block items-start justify-center font-exo lg:w-[75%] sm:flex">
            <div className="flex-1 flex flex-col justify-center text-electro-50">
                <div className="flex flex-col-reverse gap-4 w-full bg-electro-800 rounded p-4 my-8 md:grid md:grid-cols-[70%_30%]">
                    <WeaponInfo weapon={weapon} />
                    <div className="w-full overflow-clip h-[calc(100vh-4rem)] max-h-[600px] z-0 ">
                        {weapon.icon ? (
                            <ImageWithLoader
                                src={weapon.icon}
                                alt={weapon.id + "icon"}
                                width={0}
                                height={0}
                                priority
                                sizes="100%"
                                className="h-[calc(100vh-4rem)] max-h-[256px] object-cover w-auto mx-auto"
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
