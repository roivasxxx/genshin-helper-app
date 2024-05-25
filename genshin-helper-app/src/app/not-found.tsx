import Image from "next/image";
import Link from "next/link";

export default async function NotFound() {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center font-exo text-electro-50 ">
            <Image src="/images/404.webp" alt="404" width={300} height={300} />
            <h1 className="text-4xl p-2">{"Page not found :("}</h1>
            <Link
                href="/"
                className="text-2xl underline hover:text-electro-500"
            >
                Take me home
            </Link>
        </div>
    );
}
