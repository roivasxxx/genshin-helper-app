import { Metadata } from "next";
import RegisterForm from "@/components/authentication/registerForm";

export const metadata: Metadata = {
    title: "Register",
};

export default function Register() {
    return (
        <main className="w-full h-full">
            <RegisterForm />
        </main>
    );
}
