import React from "react";
import { useFieldType } from "payload/components/forms";
import { Props } from "payload/components/fields/Text";
import Select from "./Select";

const WeaponField: React.FC<Props> = (props) => {
    const { path, label, required } = props;
    const {
        value = [],
        initialValue = [],
        setValue,
    } = useFieldType<string[]>({
        path,
    });

    return (
        <>
            <Select
                fieldValue={value}
                setFieldState={setValue}
                collection="genshin-weapons"
                required={required}
                label={label || "Weapons"}
                maxSelectable={props.maxRows}
                path={path}
            />
        </>
    );
};
export default WeaponField;
