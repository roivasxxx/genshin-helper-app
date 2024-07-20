import { GenshinGuide } from "@/types/genshinTypes";
import Link from "next/link";

export default function GuideSidebar(props: { article: GenshinGuide }) {
    return (
        <aside className="hidden md:block md:sticky md:top-[7rem] bg-electro-800 p-4 text-electro-50 rounded md:order-none order-2 font-bold">
            <h2 className="text-xl">Table of Contents</h2>
            <p>
                <Link href="#weapons">Weapons</Link>
            </p>
            <p>
                <Link href="#artifacts" scroll>
                    Artifacts
                </Link>
            </p>
            <p>
                <Link href="#team-mates">Best Team Mates</Link>
            </p>
            <p>
                <Link href="#comps">Comps</Link>
            </p>
        </aside>
    );
}
