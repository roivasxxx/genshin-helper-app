import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
// needs to be dynamic in order to revalidate path
export async function GET(request: Request) {
    // TODO: add a secret that needs to be sent along with the request (path param)
    revalidatePath("/genshin-impact");

    return NextResponse.json({ revalidated: true, now: new Date() });
}
