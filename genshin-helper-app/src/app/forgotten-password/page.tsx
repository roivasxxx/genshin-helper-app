import ForgottenPasswordForm from "@/components/authentication/forgottenPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Forgotten password",
};
export default function ForgottenPassword() {
    return (
        <main className="w-full h-full">
            <ForgottenPasswordForm />
        </main>
    );
}
