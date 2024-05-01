"use client";
import FloatingLabelInput from "@/components/floatingLabelInput";
import LoadingLogo from "@/components/loadingLogo";
import { HTTP_METHOD } from "@/types";
import cmsRequest, { HttpError } from "@/utils/fetchUtils";
import {
    credentialsValidator,
    emailValidator,
    passwordValidator,
} from "@/utils/validationUtils";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";

export default function Register() {
    const [state, setState] = useState({ email: "", password: "" });
    const [errorState, setErrorState] = useState("");
    const [loading, setLoading] = useState(false);
    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            const result = await cmsRequest({
                path: "/api/public-users/register",
                method: HTTP_METHOD.POST,
                body: state,
            });
            result.status;
        } catch (error) {
            let errorMessage = "Something went wrong!";
            if (error instanceof HttpError) {
                if (error.response.status === 400) {
                    errorMessage = "Email already in use!";
                }
            }
            setState({ email: "", password: "" });
            setErrorState(errorMessage);
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
        <main>
            <div className="flex flex-col justify-center items-center w-full h-full">
                <form
                    className="flex flex-col justify-center items-center bg-electro-800 rounded text-electro-50 px-6 py-2 min-h-1/2 w-1/2"
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
                    <h2 className="text-xl">Create your account!</h2>
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
                            validation={emailValidator}
                        />
                    </div>
                    <FloatingLabelInput
                        value={state.password}
                        onChange={(e) => onChange("password", e)}
                        label="Password"
                        id="password"
                        validation={passwordValidator}
                        type="password"
                    />
                    <button
                        className={`w-full mt-4 bg-electro-500 text-electro-50 p-2 rounded flex justify-center hover:bg-electro-900 disabled:bg-gray-600`}
                        type="submit"
                        disabled={
                            !credentialsValidator.safeParse(state).success
                        }
                    >
                        {loading ? <LoadingLogo size={"7"} /> : "Submit"}
                    </button>
                    <p className="py-2">
                        Already have an account?
                        <Link
                            href="/login"
                            className="text-electro-500 px-2 underline hover:text-electro-900"
                        >
                            Log in!
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
