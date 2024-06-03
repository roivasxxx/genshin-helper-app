import Image from "next/image";

export default function LoadingLogo(props: { size: string }) {
    // className=  {`size-${props.size}... does not work for some reason
    const size = `h-${props.size} w-${props.size}`;
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
