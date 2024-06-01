"use client";

import { Dispatch, SetStateAction, forwardRef } from "react";

interface Props {
    setVisibility: Dispatch<SetStateAction<boolean>>;
    dialogClass?: string;
    test?: string;
    children?: JSX.Element;
}

const DialogModal = forwardRef<HTMLDivElement, Props>(function Dialog(
    props,
    ref
) {
    const dialogClass =
        "fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-electro-850 w-1/2 h-auto rounded p-4" +
        (props.dialogClass || "");

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-600/20">
            <div className={dialogClass} ref={ref}>
                {props.children}
            </div>
        </div>
    );
});

export default DialogModal;
