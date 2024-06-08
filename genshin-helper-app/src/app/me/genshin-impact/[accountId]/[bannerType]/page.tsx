import BannerHistory from "@/components/account/genshin/bannerHistory";
import { isNumber } from "@/utils/utils";

export const dynamic = "force-dynamic";

export default function BannerHistoryPage(props: {
    params: {
        accountId: string;
        bannerType: string;
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
                <BannerHistory
                    accountId={accountId}
                    bannerType={bannerType}
                    page={_page}
                />
            </div>
        </main>
    );
}
