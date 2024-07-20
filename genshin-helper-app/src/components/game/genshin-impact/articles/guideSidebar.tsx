import { GenshinGuide } from "@/types/genshinTypes";
import { normalizeName } from "@/utils/utils";
import Link from "next/link";

export default function GuideSidebar(props: { article: GenshinGuide }) {
    const article = props.article;
    return (
        <aside className="hidden md:block md:sticky md:top-[7rem] bg-electro-800 p-4 text-electro-50 rounded md:order-none order-2 font-bold text-lg break-all">
            <h2 className="text-xl">Table of Contents</h2>
            <p>
                <Link href="#weapons">Weapons</Link>
                {article.weapons.sections
                    .filter((el) => el.title)
                    .map((el, index) => {
                        const key = normalizeName(el.title) + `-${index}`;
                        return (
                            <p key={key} className="pl-2 text-sm">
                                <Link href={`#${key}`}>{el.title}</Link>
                            </p>
                        );
                    })}
            </p>
            <p>
                <Link href="#artifacts" scroll>
                    Artifacts
                </Link>
                {article.artifacts.sections
                    .filter((el) => el.title)
                    .map((el, index) => {
                        const key = normalizeName(el.title) + `-${index}`;
                        return (
                            <p key={key} className="pl-2 text-sm">
                                <Link href={`#${key}`}>{el.title}</Link>
                            </p>
                        );
                    })}
            </p>
            <p>
                <Link href="#team-mates">Best Team Mates</Link>
            </p>
            <p>
                <Link href="#comps">Comps</Link>
                {article.comps.sections
                    .filter((el) => el.title)
                    .map((el, index) => {
                        const key = normalizeName(el.title) + `-${index}`;
                        return (
                            <p key={key} className="pl-2 text-sm">
                                <Link href={`#${key}`}>{el.title}</Link>
                            </p>
                        );
                    })}
            </p>
        </aside>
    );
}
