"use client";

import { FormEvent, useState } from "react";
import FloatingLabelInput from "../floatingLabelInput";
import { emailValidator, passwordValidator } from "@/utils/validationUtils";
import cmsRequest from "@/utils/fetchUtils";
import { HTTP_METHOD } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { redirect, useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
    const [state, setState] = useState({
        password: "",
        confirmPassword: "",
        status: "",
    });
    const searchParams = useSearchParams();

    const token = searchParams?.get("token");
    if (!token) {
        redirect("/");
    }

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (
            !(
                emailValidator.safeParse(state.password).success &&
                emailValidator.safeParse(state.confirmPassword).success &&
                state.password === state.confirmPassword
            )
        ) {
            return;
        }
        try {
            await cmsRequest({
                path: "/api/public-users/reset-password",
                method: HTTP_METHOD.POST,
                body: { email: state.password, token },
            });
            setState({ ...state, status: "success" });
        } catch (error) {
            setState({ ...state, status: "error" });
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <div className="flex flex-col justify-center items-center bg-electro-800 rounded text-electro-50 px-6 py-2 h-1/2 w-1/2">
                <Link
                    href="/game/genshin-impact"
                    className="flex-1 w-full flex flex-row items-center justify-center shrink-0 my-2 text-electro-50 hover:text-electro-500"
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
                {state.status === "success" ? (
                    <div className="w-full flex-[2]">
                        <p
                            className={`
                            text-lg text-green-500 py-2 w-full rounded text-center font-bold`}
                        >
                            Password reset successful!
                            <Link
                                href="/login"
                                className="text-electro-500 px-2 hover:text-electro-900 active:text-electro-900"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                ) : (
                    <form
                        className="w-full flex-[2]"
                        onSubmit={onSubmit}
                        autoComplete="off"
                        role="presentation"
                    >
                        <h2 className="text-xl my-2">
                            Enter your new password.
                        </h2>
                        <FloatingLabelInput
                            label="Password"
                            value={state.password}
                            onChange={(event) =>
                                setState({
                                    ...state,
                                    password: event.target.value,
                                    status: "",
                                })
                            }
                            validation={passwordValidator}
                            placeholder="New password"
                            id=""
                        />
                        <FloatingLabelInput
                            label="Confirm password"
                            value={state.password}
                            onChange={(event) =>
                                setState({
                                    ...state,
                                    confirmPassword: event.target.value,
                                    status: "",
                                })
                            }
                            validation={passwordValidator}
                            placeholder="Confirm password"
                            id=""
                        />
                        {state.status === "error" ? (
                            <p
                                className={`bg-red-500
                        text-lg py-2 w-full rounded text-center font-bold`}
                            >
                                Something went wrong
                            </p>
                        ) : (
                            <></>
                        )}
                        <button
                            disabled={
                                !(
                                    emailValidator.safeParse(state.password)
                                        .success &&
                                    emailValidator.safeParse(
                                        state.confirmPassword
                                    ).success &&
                                    state.password === state.confirmPassword
                                )
                            }
                            className={`w-full mt-4 bg-electro-500 text-electro-50 p-2 rounded hover:bg-electro-900 disabled:bg-gray-600 flex justify-center`}
                            type="submit"
                        >
                            Change password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
