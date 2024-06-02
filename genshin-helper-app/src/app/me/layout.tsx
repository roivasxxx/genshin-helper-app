import AccountNavbar from "@/components/account/accountNavbar";
import Footer from "@/components/footer";

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="flex-grow">
                <AccountNavbar />
                {children}
            </div>
            <Footer />
        </>
    );
}
