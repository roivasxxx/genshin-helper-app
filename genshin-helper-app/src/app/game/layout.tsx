import Header from "@/components/root-layout/nav/header";

export default async function GameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Header />
                {children}
            </div>
        </>
    );
}
