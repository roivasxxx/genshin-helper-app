import Banner from "@/components/account/genshin/banner";
import { BANNER_TYPE, GENSHIN_BANNER_NAME } from "@/utils/constants";
import { isNumber } from "@/utils/utils";
import { Metadata, ResolvingMetadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
    params: { bannerType: BANNER_TYPE };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.bannerType;
    let title = `${GENSHIN_BANNER_NAME[id]} banner`;

    return {
        title: title,
    };
}

export default function UserBannerPage(props: {
    params: {
        accountId: string;
        bannerType: BANNER_TYPE;
    };
    searchParams: {
        page: string;
    };
}) {
    const { accountId, bannerType } = props.params;
    const { page } = props.searchParams;
    const _page = isNumber(page) ? Number(page) : 1;

    return (
        <main className="w-full mt-[7rem] mx-auto p-4 my-8 rounded items-start justify-center text-electro-50 font-exo lg:w-[75%] sm:flex">
            <div className="w-full flex flex-col justify-center">
                <Banner
                    accountId={accountId}
                    bannerType={bannerType}
                    page={_page}
                />
            </div>
        </main>
    );
}
