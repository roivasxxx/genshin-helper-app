"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import ENV from "@/utils/env-utils";
import { signIn } from "next-auth/react";
import FloatingLabelInput from "../floatingLabelInput";
import Link from "next/link";
import Image from "next/image";
import LoadingLogo from "../loadingLogo";
import { emailValidator } from "@/utils/validationUtils";

export default function LoginForm() {
    const [state, setState] = useState({ email: "", password: "" });
    const [errorState, setErrorState] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);

        const loginResult = await signIn("credentials", {
            ...state,
            redirect: false,
        });
        if (loginResult?.error) {
            setErrorState(loginResult?.error);
        }

        setLoading(false);
    };

    const onChange = (
        prop: keyof typeof state,
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setErrorState("");
        setState({ ...state, [prop]: event.target.value });
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <form
                className="flex flex-col justify-center items-center bg-electro-800 rounded text-electro-50 px-6 py-2 h-1/2 w-1/2"
                onSubmit={onSubmit}
                autoComplete="off"
                role="presentation"
            >
                <Link
                    href="/game/genshin-impact"
                    className="w-full flex flex-row items-center justify-center shrink-0 my-2 text-electro-50 hover:text-electro-500"
                >
                    <div className="size-9 md:size-12">
                        <Image
                            src="/images/logo.svg"
                            alt="Electro Mains"
                            width="0"
                            height="0"
                            sizes="100vw"
                            className="w-full h-auto"
                            priority
                        />
                    </div>
                    <h1 className="text-4xl font-bebas">Electro Mains</h1>
                </Link>
                <h2 className="text-xl">Log in to your account!</h2>
                {errorState ? (
                    <div>
                        <p className="text-red-500 py-2">{errorState}</p>
                    </div>
                ) : (
                    <></>
                )}
                <div className="w-full my-2">
                    <FloatingLabelInput
                        value={state.email}
                        onChange={(e) => onChange("email", e)}
                        label="Email"
                        id="email"
                        autoComplete="new-password" // disable autofill
                        required
                    />
                </div>
                <FloatingLabelInput
                    value={state.password}
                    onChange={(e) => onChange("password", e)}
                    label="Password"
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                />
                <button
                    className={`w-full mt-4 bg-electro-500 text-electro-50 p-2 rounded hover:bg-electro-900 disabled:bg-gray-600`}
                    type="submit"
                    disabled={
                        !emailValidator.safeParse(state.email).success ||
                        state.password === ""
                    }
                >
                    {loading ? <LoadingLogo size={"7"} /> : "Submit"}
                </button>
                <p className="py-2">
                    Don't have an account?
                    <Link
                        href="/register"
                        className="text-electro-500 px-2 underline hover:text-electro-900"
                    >
                        Sign up!
                    </Link>
                </p>
            </form>
        </div>
    );
}
