// import Test from "@/components/test";

import AccountInfo from "@/components/account/accountInfo";

export const dynamic = "force-dynamic";

export default async function Me() {
    return (
        <main className="w-full mt-[7rem] mx-auto p-4 my-8 rounded items-start justify-center text-electro-50 font-exo lg:w-[75%] sm:flex">
            <div className="w-full flex flex-col justify-center">
                <AccountInfo />
            </div>
        </main>
    );
}
