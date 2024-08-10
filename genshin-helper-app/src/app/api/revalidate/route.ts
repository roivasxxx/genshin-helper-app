import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PATHS_TO_REVALIDATE = ["articles", "article", "character", "weapon"];
// needs to be dynamic in order to revalidate path
export async function GET(request: Request) {
    // TODO: add a secret that needs to be sent along with the request (path param)
    const _url = request.url;
    const url = new URL(_url);
    const search = url.searchParams;
    const secret = search.get("secret");
    // path to be revalidted
    const path = search.get("path");
    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
        console.error("Revalidate secret mismatch: ", secret);
        return NextResponse.json({ revalidated: false, now: new Date() });
    }
    if (!path || !PATHS_TO_REVALIDATE.includes(path)) {
        console.error("Invalid path: ", path);
        return NextResponse.json({ revalidated: false, now: new Date() });
    }
    switch (path) {
        case "article":
            const articleId = search.get("articleId");
            if (!articleId) {
                console.error("Invalid articleId: ", articleId);
                return NextResponse.json({
                    revalidated: false,
                    now: new Date(),
                });
            }
            revalidatePath(`/game/genshin-impact/articles/${articleId}`);
            revalidatePath("/game/genshin-impact/articles");
            break;
        case "character":
            const characterId = search.get("characterId");
            if (!characterId) {
                console.error("Invalid characterId: ", characterId);
                return NextResponse.json({
                    revalidated: false,
                    now: new Date(),
                });
            }
            revalidatePath(
                `/game/genshin-impact/wiki/characters/${characterId}`
            );
            revalidatePath("/game/genshin-impact/wiki/characters");
            break;
        case "weapon":
            const weaponId = search.get("weaponId");
            if (!weaponId) {
                console.error("Invalid weaponId: ", weaponId);
                return NextResponse.json({
                    revalidated: false,
                    now: new Date(),
                });
            }
            revalidatePath(`/game/genshin-impact/wiki/weapons/${weaponId}`);
            revalidatePath("/game/genshin-impact/wiki/weapons");
            break;
    }

    return NextResponse.json({ revalidated: true, now: new Date() });
}
