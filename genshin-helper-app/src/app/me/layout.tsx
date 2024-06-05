import AccountNavbar from "@/components/account/accountNavbar";
import AccountProvider from "@/components/account/accountProvider";
import Footer from "@/components/footer";

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="flex-grow">
                <AccountProvider>
                    <AccountNavbar />
                    {children}
                </AccountProvider>
            </div>
            <Footer />
        </>
    );
}
