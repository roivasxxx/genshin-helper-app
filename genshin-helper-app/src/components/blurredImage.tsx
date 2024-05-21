import Image, { ImageProps } from "next/image";
import { getPlaiceholder } from "plaiceholder";

export default async function BlurredImage(
    props: ImageProps & { src: string }
) {
    const res = await fetch(props.src);
    if (!res.ok) {
        return <>{props.alt}</>;
    }
    const buffer = await res.arrayBuffer();

    const { base64 } = await getPlaiceholder(Buffer.from(buffer));

    return <Image {...props} placeholder="blur" blurDataURL={base64} />;
}
