export default function Arrow(props: {
    size: "small" | "medium" | "large";
    className: string;
}) {
    let size = "";

    switch (props.size) {
        case "small":
            size =
                "size-3 border-b-2 border-r-2 border-electro-50 rotate-[-45deg]";
            break;
        case "medium":
            size =
                "size-5 border-b-2 border-r-2 border-electro-50 rotate-[-45deg]";
            break;
        case "large":
            size =
                "size-8 border-b-2 border-r-2 border-electro-50 rotate-[-45deg]";
            break;
    }

    return <span className={`${size} ${props.className}`}></span>;
}
