import React, { useState } from "react";
const ImageWithFallback = (props: {
    src: string;
    alt: string;
    className: string;
    fallbackClassName: string;
}) => {
    const { fallbackClassName, ...rest } = props;

    const [errored, setIsErrored] = useState(true);

    return (
        <div className="genshin-picker__item--image-relative">
            <div
                className={`${fallbackClassName} ${errored ? "" : "hidden"}`}
            />
            <img
                className={`${props.className} ${errored ? "hidden" : ""}`}
                src={props.src}
                alt={props.alt}
                onError={() => setIsErrored(true)}
                onLoad={() => setIsErrored(false)}
            />
        </div>
    );
};
export default ImageWithFallback;
