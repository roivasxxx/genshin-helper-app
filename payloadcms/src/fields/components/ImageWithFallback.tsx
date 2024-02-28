import React, { useState } from "react";
const ImageWithFallback = (props: {
    src: string;
    alt: string;
    className: string;
    fallbackClassName: string;
}) => {
    const { fallbackClassName, ...rest } = props;

    const [errored, setIsErrored] = useState(true);
    return errored ? (
        <div className={fallbackClassName} />
    ) : (
        <img
            {...rest}
            onError={() => setIsErrored(true)}
            onLoad={() => setIsErrored(false)}
        />
    );
};
export default ImageWithFallback;
