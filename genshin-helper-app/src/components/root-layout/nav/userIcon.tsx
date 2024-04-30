import Link from "next/link";

export default function UserIcon() {
    return (
        <Link
            href="/me"
            className="w-10 h-10 rounded-full relative overflow-hidden mx-2 bg-electro-900"
        >
            <div className="w-5 h-5 bg-electro-500 rounded-full absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%]" />
            <div className="w-7 h-5 bg-electro-500 rounded-full absolute top-[85%] left-[50%] translate-x-[-50%] translate-y-[-50%]" />
            <div className="w-full h-full absolute top-0 left-0 rounded-full opacity-0 bg-electro-200/20 hover:cursor-pointer hover:opacity-100" />
        </Link>
    );
}
