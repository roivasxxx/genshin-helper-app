"use client";

import { FormEvent, useState } from "react";
import FloatingLabelInput from "../floatingLabelInput";
import { emailValidator } from "@/utils/validationUtils";
import cmsRequest from "@/utils/fetchUtils";
import { HTTP_METHOD } from "@/types";
import Link from "next/link";
import Image from "next/image";

export default function ForgottenPasswordForm() {
    const [state, setState] = useState({ email: "", status: "" });

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!emailValidator.safeParse(state.email).success) {
            return;
        }
        try {
            await cmsRequest({
                path: "/api/public-users/forgot-password",
                method: HTTP_METHOD.POST,
                body: { email: state.email },
            });
            setState({ ...state, status: "success" });
        } catch (error) {
            setState({ ...state, status: "error" });
        }
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
                <h2 className="text-xl my-2">
                    Forgot your password? Just enter your email address, and
                    we'll send you a link to create a new one.
                </h2>
                <FloatingLabelInput
                    label="Email"
                    value={state.email}
                    onChange={(event) =>
                        setState({
                            ...state,
                            email: event.target.value,
                            status: "",
                        })
                    }
                    validation={emailValidator}
                    placeholder="Email"
                    id=""
                />
                {state.status ? (
                    <p
                        className={`${
                            state.status === "success"
                                ? "bg-green-500"
                                : "bg-red-500"
                        } text-lg py-2 w-full rounded text-center font-bold`}
                    >
                        {state.status === "success"
                            ? "Email sent"
                            : "Something went wrong"}
                    </p>
                ) : (
                    <></>
                )}
                <button
                    disabled={!emailValidator.safeParse(state.email).success}
                    className={`w-full mt-4 bg-electro-500 text-electro-50 p-2 rounded hover:bg-electro-900 disabled:bg-gray-600 flex justify-center`}
                    type="submit"
                >
                    Send reset link
                </button>
            </form>
        </div>
    );
}
