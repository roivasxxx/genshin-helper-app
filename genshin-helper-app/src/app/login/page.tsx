import LoginForm from "@/components/authentication/loginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login",
};

export default function Login() {
    return (
        <main className="w-full h-full">
            <LoginForm />
        </main>
    );
}
