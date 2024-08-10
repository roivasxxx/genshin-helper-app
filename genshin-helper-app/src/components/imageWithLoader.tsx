"use client";
import Image, { ImageProps } from "next/image";

export default function ImageWithLoader(props: ImageProps) {
    return <Image {...props} loader={({ src }) => src} />;
}
