import { ReactNode } from "react";

export default function ShowcaseClickable(props: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    children: ReactNode;
    className?: string;
}) {
    const { onClick, className, children } = props;

    return (
        <button onClick={onClick} className={className}>
            {children}
        </button>
    );
}
