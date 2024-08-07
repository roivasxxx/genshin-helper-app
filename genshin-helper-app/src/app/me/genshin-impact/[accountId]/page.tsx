import GenshinAccountOverview from "@/components/account/genshin/genshinAccountOverview";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Genshin account",
};

export default function GenshinAccount(props: {
    params: {
        accountId: string;
    };
}) {
    const { accountId } = props.params;
    return (
        <main className="w-full mt-[7rem] mx-auto p-4 my-8 rounded items-start justify-center text-electro-50 font-exo lg:w-[75%] sm:flex">
            <div className="w-full flex flex-col justify-center">
                <GenshinAccountOverview accountId={accountId} />
            </div>
        </main>
    );
}
