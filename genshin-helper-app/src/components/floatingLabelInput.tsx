"use client";

import { DetailedHTMLProps, InputHTMLAttributes, useState } from "react";
import { ZodError, ZodTypeAny } from "zod";

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
    validation?: ZodTypeAny;
    hintText?: string;
}

export default function FloatingLabelInput(props: FloatingLabelInputProps) {
    const {
        label,
        placeholder,
        id,
        value,
        onChange,
        labelBgColor,
        validation,
        ...rest
    } = props;
    const [edited, setEdited] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const _labelBgColor = labelBgColor || "bg-electro-800";

    let validationErrors: string[] = [];

    if (edited && !isFocused && validation) {
        try {
            validation.parse(value);
        } catch (error) {
            if (error instanceof ZodError && error.errors.length > 0) {
                validationErrors = error.errors.map((e) => e.message);
            }
        }
    }

    const validationFailed =
        validationErrors.length > 0 && !isFocused && edited;
    const validationFailedBorder = validationFailed
        ? "border-red-500"
        : "border-electro-50/80";
    const validationFailedText = validationFailed
        ? "!text-red-500"
        : "text-electro-50/90";
    return (
        <>
            <div className="relative mt-2 w-full">
                <input
                    type="text"
                    id={id}
                    value={value}
                    className={`border-2 peer block w-full appearance-none rounded-lg border ${validationFailedBorder} bg-transparent px-4 py-4 text-sm text-electro-50 focus:border-electro-500 focus:outline-none focus:ring-0`}
                    onChange={(e) => {
                        onChange(e);
                        setEdited(true);
                    }}
                    placeholder=""
                    tabIndex={0}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...rest}
                />
                <label
                    htmlFor={id}
                    className={`absolute pointer-events-none top-1 left-1 z-[1] origin-[0] -translate-y-4 scale-75 transform cursor-text select-none ${_labelBgColor} mx-2 px-2 text-base ${validationFailedText} duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-electro-300`}
                >
                    {label}
                </label>
            </div>
            <div className="w-full whitespace-nowrap py-2 px-4">
                {validationErrors.map((error, index) => (
                    <p
                        key={`${id}-error-${index}`}
                        className="text-red-500 py-1 w-full"
                    >
                        {error}
                    </p>
                ))}
            </div>
        </>
    );
}
