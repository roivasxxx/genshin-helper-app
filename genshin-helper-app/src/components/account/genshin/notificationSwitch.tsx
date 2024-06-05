import React from "react";

export default function NotificationSwitch(props: {
    label: string;
    isChecked: boolean;
    onChange: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center p-2">
            <input
                className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-400 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-green-200 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem]  checked:after:bg-green-500 hover:cursor-pointer"
                type="checkbox"
                role="switch"
                id="flexSwitchChecked"
                checked={props.isChecked}
                onChange={props.onChange}
            />
            <label
                className="pt-1 hover:cursor-pointer"
                htmlFor="flexSwitchChecked"
            >
                {props.label}
            </label>
        </div>
    );
}
