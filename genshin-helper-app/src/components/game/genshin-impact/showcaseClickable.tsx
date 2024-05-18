import { ReactNode } from "react";

interface ShowcaseClickableProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    children: ReactNode;
    className?: string;
}

export default function ShowcaseClickable(props: ShowcaseClickableProps) {
    const { onClick, className, children, ...rest } = props;

    const defaultClass =
        "flex items-center justify-center w-full h-full min-h-10 rounded group hover:bg-electro-300 hover:text-electro-50 ";

    return (
        <button
            onClick={onClick}
            className={defaultClass + className}
            {...rest}
        >
            {children}
        </button>
    );
}
