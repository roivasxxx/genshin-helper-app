// import Test from "@/components/test";
import { getServerSession } from "next-auth";
import { RedirectType, redirect } from "next/navigation";

export default async function Me() {
    return (
        <div className="mt-20">
            <h1>Me</h1>
            {/* <Test /> */}
        </div>
    );
}
