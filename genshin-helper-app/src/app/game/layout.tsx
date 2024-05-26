import Footer from "@/components/footer";
import Header from "@/components/root-layout/nav/header";

export default async function GameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="flex-grow">
                <Header />
                {children}
            </div>
            <Footer />
        </>
    );
}
