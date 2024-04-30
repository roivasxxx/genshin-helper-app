"use client";

import { FormEvent, useState } from "react";
import ENV from "@/utils/env-utils";
import cmsRequest from "@/utils/fetchUtils";
import { signIn } from "next-auth/react";
import FloatingLabelInput from "../floatingLabelInput";
import Link from "next/link";
import Image from "next/image";

export default function LoginForm() {
    const [state, setState] = useState({ email: "", password: "" });

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        console.log(process.env.NEXT_PUBLIC_BACKEND_URL, ENV.BACKEND_URL);
        signIn("credentials", state);
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <form
                className="flex flex-col justify-center items-center bg-electro-800 rounded text-electro-50 px-6 py-2 h-1/2 w-1/2"
                onSubmit={onSubmit}
                autoComplete="off"
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
                <div className="w-full my-2">
                    <FloatingLabelInput
                        value={state.email}
                        onChange={(e) =>
                            setState({ ...state, email: e.target.value })
                        }
                        label="Email"
                        id="email"
                    />
                </div>
                <FloatingLabelInput
                    value={state.password}
                    onChange={(e) =>
                        setState({ ...state, password: e.target.value })
                    }
                    label="Password"
                    id="password"
                />
                <button
                    className={`w-full mt-4 bg-electro-500 text-electro-50 p-2 rounded hover:bg-electro-900 disabled:bg-gray-600`}
                    type="submit"
                    disabled={state.email === "" || state.password === ""}
                >
                    Submit
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
