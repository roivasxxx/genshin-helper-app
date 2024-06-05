import GenshinNotificationSettings from "@/components/account/genshin/notificationsSettings";

export const dynamic = "force-dynamic";
export default function NotificationSettings() {
    return (
        <main className="w-full mt-[7rem] mx-auto p-4 my-8 rounded items-start justify-center text-electro-50 font-exo lg:w-[75%] sm:flex">
            <div className="w-full flex flex-col justify-center">
                <div className="w-full flex flex-col bg-electro-800 rounded bg-electro-800 rounded min-h-[10rem] p-2">
                    <GenshinNotificationSettings />
                </div>
            </div>
        </main>
    );
}
