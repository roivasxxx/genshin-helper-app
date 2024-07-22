import ResetPasswordForm from "@/components/authentication/resetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Reset password",
};

export default function ResetPassword() {
    return (
        <main className="w-full h-full">
            <ResetPasswordForm />
        </main>
    );
}
