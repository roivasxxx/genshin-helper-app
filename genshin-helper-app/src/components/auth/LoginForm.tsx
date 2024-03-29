"use client";

import { FormEvent, useState } from "react";
import ENV from "@/utils/env-utils";
import cmsRequest from "@/utils/fetchUtils";
import { signIn } from "next-auth/react";

export default function LoginForm() {
    const [state, setState] = useState({ email: "", password: "" });

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        console.log(process.env.NEXT_PUBLIC_BACKEND_URL, ENV.BACKEND_URL);
        signIn("credentials", state);
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={state.email}
                        onChange={(e) =>
                            setState({ ...state, email: e.target.value })
                        }
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={state.password}
                        onChange={(e) =>
                            setState({ ...state, password: e.target.value })
                        }
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
