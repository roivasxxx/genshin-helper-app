import Test from "@/components/test";
import { getServerSession } from "next-auth";
import { RedirectType, redirect } from "next/navigation";

/**
 * Base user profile page
 */
export default async function Me() {
    console.log("/me page");
    return (
        <main>
            <div>
                <h1>Me</h1>
                <Test />
            </div>
        </main>
    );
}
