import Image from "next/image";

/**
 *
 * @param props - size - the size of the logo,  eg. "size-40"
 * @returns
 */
export default function LoadingLogo(props: { size: string }) {
    return (
        <div className={`${props.size} animate-spin`}>
            <Image
                src="/images/logo.svg"
                alt="Spinning logo"
                width="0"
                height="0"
                sizes="100vw"
                className="w-full h-auto"
                priority
            />
        </div>
    );
}
