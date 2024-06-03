import AccountInfo from "./accountInfo";
import AccountProvider from "./accountProvider";

export default function AccountProviderWrapper() {
    return (
        <AccountProvider>
            <AccountInfo />
        </AccountProvider>
    );
}
