"use client";

import { forwardRef } from "react";

interface Props {
    setVisibility: () => void;
    dialogClass?: string;
    children?: JSX.Element;
}

const DialogModal = forwardRef<HTMLDivElement, Props>(function Dialog(
    props,
    ref
) {
    const dialogClass =
        "fixed flex flex-col top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-electro-850 w-[90%] md:w-[60%] h-[60%] rounded p-4 z-50" +
        (props.dialogClass || "");

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-600/50 z-50">
            <div className={dialogClass} ref={ref}>
                <button
                    onClick={props.setVisibility}
                    className="absolute top-0 right-0 p-4 before:absolute before:border-b-2 before:w-6 before:left-0 before:top-[50%] before:rotate-45 after:absolute after:border-b-2 after:w-6 after:left-0 after:top-[50%] after:rotate-[-45deg] hover:before:border-electro-500 hover:after:border-electro-500 active:after:border-electro-500 active:before:border-electro-500"
                />
                <div className="h-full mt-5 overflow-y-auto">
                    {props.children}
                </div>
            </div>
        </div>
    );
});

export default DialogModal;
