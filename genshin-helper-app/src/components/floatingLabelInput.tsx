"use client";

import { DetailedHTMLProps, InputHTMLAttributes } from "react";

interface FloatingLabelInputProps
    extends Partial<
        DetailedHTMLProps<
            InputHTMLAttributes<HTMLInputElement>,
            HTMLInputElement
        >
    > {
    label: string;
    id: string;
    value: string;
    labelBgColor?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FloatingLabelInput(props: FloatingLabelInputProps) {
    const { label, placeholder, id, value, onChange, labelBgColor, ...rest } =
        props;

    const _labelBgColor = labelBgColor || "bg-electro-800";

    return (
        <div className="relative mt-2 w-full">
            <input
                type="text"
                id={id}
                value={value}
                className="border-2 peer block w-full appearance-none rounded-lg border border-electro-50/80 bg-transparent px-4 pb-2.5 pt-4 text-sm text-electro-50 focus:border-electro-500 focus:outline-none focus:ring-0"
                onChange={onChange}
                placeholder=""
                tabIndex={0}
                {...rest}
            />
            <label
                htmlFor={id}
                className={`absolute top-1 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none ${_labelBgColor} mx-2 px-2 text-base text-electro-50/90 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-electro-300`}
            >
                {label}
            </label>
        </div>
    );
}
